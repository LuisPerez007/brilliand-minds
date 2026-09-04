import dataBase from '../../db/dataBase.js'

export const controlPagosDeEstudiantesACursos = async () => {
  const informe = await dataBase.query(`
    SELECT
      ins.id_inscripcion,
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
    WHERE ins.estado_pago = 'PENDIENTE'
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
