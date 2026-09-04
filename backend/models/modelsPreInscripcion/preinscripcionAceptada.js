import dataBase from '../../db/dataBase.js'

export const preinscripcionAceptada = async (idSolicitud) => {
  const informe = await dataBase.query(`
      UPDATE pre_inscripcion_estudiante
      SET estado = 'Aprobada'
      WHERE id_solicitud = $1
  `, [idSolicitud])

  return informe.rowCount
}
