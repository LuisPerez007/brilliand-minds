import dataBase from '../../db/dataBase.js'

export const obtenerCursosDisponibles = async () => {
  const informe = await dataBase.query(`
    SELECT id_curso, nombre AS materia, descripcion, duracion, costo, cupo_total from curso`
  , [])
  return informe
}
