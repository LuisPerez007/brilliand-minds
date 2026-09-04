import dataBase from '../../db/dataBase.js'

export const eliminarInscripcionPorEstudiante = async (id) => {
  const informe = await dataBase.query(`DELETE FROM inscripcion
    WHERE id_estudiante = $1`, [id])
  return informe.rowCount
}
