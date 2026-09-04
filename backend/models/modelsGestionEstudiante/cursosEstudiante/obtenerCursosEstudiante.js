import dataBase from '../../../db/dataBase.js'

export const obtenerCursosParaEstudiante = async (idUsuario) => {
  const informe = await dataBase.query(`
        SELECT cur.id_curso, cur.nombre AS materia, ins.fecha_inscripcion,
        EXTRACT(YEAR FROM ins.fecha_inscripcion) as periodo
        FROM curso cur
        JOIN inscripcion ins ON ins.id_curso = cur.id_curso
        JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
        WHERE est.id_usuario = $1
        ORDER BY ins.fecha_inscripcion desc
        `, [idUsuario])
  return informe
}

export const obtenerCalificacionesDelEstudiante = (idCurso, idUsuario) => {
  const informe = dataBase.query(`
    SELECT cur.id_curso, eva.id_evaluacion, eva.fecha_evaluacion, cur.nombre AS materia, eva.nombre_evaluacion, eva.porcentaje, cal.nota, cal.observacion
    FROM calificacion cal
    JOIN inscripcion ins ON ins.id_inscripcion = cal.id_inscripcion
    JOIN curso cur ON cur.id_curso = ins.id_curso
    JOIN evaluacion eva ON eva.id_evaluacion = cal.id_evaluacion
    JOIN estudiante est ON est.id_estudiante = cal.id_estudiante
    WHERE cur.id_curso = $1 and  est.id_usuario = $2
    `, [idCurso, idUsuario])
  return informe
}

export const obtenerCursosNoInscritosDelEstudiante = async (idUsuario) => {
  const informe = await dataBase.query(`
  SELECT cur.id_curso, cur.nombre AS materia, cur.descripcion, cur.duracion, cur.costo, cur.cupo_total
  FROM curso cur
  WHERE cur.id_curso NOT IN (
  SELECT ins.id_curso
  FROM inscripcion ins
  JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
  WHERE est.id_usuario = $1
  )`, [idUsuario])
  return informe
}

export const crearInscripcionAunCurso = async (idEstudiante, idCurso) => {
  const inscripcion = await dataBase.query(`
        INSERT INTO inscripcion (id_estudiante, id_curso)
        VALUES ($1, $2)
        `, [idEstudiante, idCurso])
  return inscripcion
}

export const obtenerEstudiante = async (idUsuario) => {
  const informe = await dataBase.query(
    ` SELECT est.id_estudiante
      FROM estudiante est
      WHERE est.id_usuario = $1
    `,
    [idUsuario]
  )

  return informe.rows[0].id_estudiante
}
