import dataBase from '../../db/dataBase.js'

export const mostrarRecibos = async () => {
  const informe = await dataBase.query(`
    SELECT * FROM historial_inscripciones ORDER BY fecha_pago DESC
  `)
  return informe
}

export const verificarRecibo = async (idRecibo) => {
  const informe = await dataBase.query(`
    SELECT
      id_recibo,
      id_inscripcion,
      padre_tutor,
      padre_ci,
      estudiante,
      curso,
      monto_pagado,
      fecha_pago
    FROM historial_inscripciones
    WHERE id_recibo = $1
    LIMIT 1
  `, [idRecibo])
  return informe
}

export const registrarRecibos = async (datos) => {
  const { idInscripcion, padreTutor, padreCi, montoPagado, idPadre, idEstudiante, estudiante, idCurso, curso } = datos
  const informe = await dataBase.query(`
    INSERT INTO historial_inscripciones ( id_inscripcion, padre_tutor, padre_ci, monto_pagado, id_padre, id_estudiante, estudiante, id_curso, curso)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_recibo, id_inscripcion, padre_tutor, padre_ci, monto_pagado, fecha_pago
  `, [idInscripcion, padreTutor, padreCi, montoPagado, idPadre, idEstudiante, estudiante, idCurso, curso])
  return informe
}

export const telefonoTutorActivo = async (idTutor) => {
  const { rows } = await dataBase.query(
    `SELECT telefono FROM padre_tutor
     WHERE id_tutor = $1 AND estado = 'Activo'`,
    [idTutor]
  )
  return rows[0]?.telefono ?? null
}

export const controlPagosDeEstudiantesACursos = async () => {
  const informe = await dataBase.query(`
    SELECT
      ins.id_inscripcion,
      est.id_estudiante,
      cur.id_curso,
      ins.fecha_inscripcion,
      (est.nombre || ' ' || est.a_paterno || ' ' || est.a_materno) AS estudiante,
      est.ci,
      est.direccion,
      est.telefono,
      cur.nombre AS materia,
      cur.costo,
      ins.estado_pago
    FROM inscripcion ins
    JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
    JOIN curso cur ON cur.id_curso = ins.id_curso
    ORDER BY ins.fecha_inscripcion ASC`)
  return informe
}

export const marcarInscripcionComoPagada = async (idInscripcion) => {
  const informe = await dataBase.query(`
    UPDATE inscripcion
    SET estado_pago = 'PAGADO'
    WHERE id_inscripcion = $1
`, [idInscripcion])
  return informe
}
