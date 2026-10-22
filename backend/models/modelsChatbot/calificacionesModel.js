import dataBase from '../../db/dataBase.js'

// Ajusta estos dos valores a la escala real de la academia
const NOTA_MINIMA_APROBACION = 51 // supuesto: escala sobre 100

const filasDeCalificaciones = async (idEstudiante) => {
  const { rows } = await dataBase.query(
    `SELECT cu.id_curso, cu.nombre AS curso, cu.descripcion, cu.duracion,
            cu.estado AS estado_curso,
            pr.nombre || ' ' || pr.a_paterno AS profesor,
            ins.id_inscripcion, ins.fecha_inscripcion,
            ev.id_evaluacion, ev.nombre_evaluacion,
            ev.descripcion AS descripcion_evaluacion,
            ev.fecha_evaluacion, ev.porcentaje,
            ca.nota, ca.observacion
     FROM inscripcion ins
     JOIN curso cu ON cu.id_curso = ins.id_curso
     LEFT JOIN profesor pr ON pr.id_profesor = cu.id_profesor
     LEFT JOIN evaluacion ev ON ev.id_curso = cu.id_curso
     LEFT JOIN calificacion ca ON ca.id_evaluacion = ev.id_evaluacion
                              AND ca.id_inscripcion = ins.id_inscripcion
     WHERE ins.id_estudiante = $1
     ORDER BY ins.fecha_inscripcion DESC, ev.fecha_evaluacion`,
    [idEstudiante]
  )
  return rows
}

// Agrupa las filas por inscripción y calcula nota final y resultado
export const calificacionesDelEstudiante = async (idEstudiante) => {
  const filas = await filasDeCalificaciones(idEstudiante)
  const cursos = new Map()

  for (const f of filas) {
    if (!cursos.has(f.id_inscripcion)) {
      cursos.set(f.id_inscripcion, {
        id_curso: f.id_curso,
        id_inscripcion: f.id_inscripcion,
        curso: f.curso,
        descripcion: f.descripcion,
        duracion: f.duracion,
        estado_curso: f.estado_curso,
        profesor: f.profesor,
        fecha_inscripcion: f.fecha_inscripcion,
        evaluaciones: []
      })
    }
    if (f.id_evaluacion !== null) {
      cursos.get(f.id_inscripcion).evaluaciones.push({
        id_evaluacion: f.id_evaluacion,
        nombre_evaluacion: f.nombre_evaluacion,
        descripcion: f.descripcion_evaluacion,
        fecha_evaluacion: f.fecha_evaluacion,
        porcentaje: Number(f.porcentaje),
        nota: f.nota === null ? null : Number(f.nota),
        observacion: f.observacion
      })
    }
  }

  const lista = [...cursos.values()].map((c) => {
    const evs = c.evaluaciones
    const completo = evs.length > 0 && evs.every((e) => e.nota !== null)

    let notaFinal = null
    let resultado = 'EN_PROCESO' // sin evaluaciones o con notas pendientes

    if (completo) {
      const sumaPorc = evs.reduce((a, e) => a + e.porcentaje, 0)
      const ponderada = evs.reduce((a, e) => a + e.nota * e.porcentaje, 0)
      notaFinal = sumaPorc > 0 ? Number((ponderada / sumaPorc).toFixed(2)) : null
      if (notaFinal !== null) {
        resultado = notaFinal >= NOTA_MINIMA_APROBACION ? 'APROBADO' : 'REPROBADO'
      }
    }

    return { ...c, notaFinal, resultado }
  })

  // Cursos activos primero, finalizados después
  lista.sort((a, b) => {
    const aAct = a.estado_curso === 'Activo' ? 0 : 1
    const bAct = b.estado_curso === 'Activo' ? 0 : 1
    return aAct - bAct
  })

  return lista
}
