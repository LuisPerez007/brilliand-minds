import dataBase from '../../db/dataBase.js'

export const preinscripcionRechazada = async (idEstudiante) => {
  const informe = await dataBase.query(
    `
    UPDATE pre_inscripcion_estudiante
    SET estado = 'Rechazada'
    WHERE id_solicitud = $1 
    `,
    [idEstudiante])
  return informe.rowCount
}
