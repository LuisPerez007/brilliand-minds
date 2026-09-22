import dataBase from '../../db/dataBase.js'

export const eliminarInscripcionPorId = async (id) => {
  const eliminar = await dataBase.query('DELETE FROM inscripcion WHERE id_inscripcion = $1 RETURNING *', [id])
  return eliminar
}

export const eliminarTodasInscripcionesDelCurso = async (idCurso) => {
  const informe = await dataBase.query(`
    DELETE FROM inscripcion WHERE id_curso = $1 
    `, [idCurso])
  return informe
}
