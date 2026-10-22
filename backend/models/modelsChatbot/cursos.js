import dataBase from '../../db/dataBase.js'

export const cursosActivos = async () => {
  const { rows } = await dataBase.query(
    `SELECT id_curso, nombre, descripcion, duracion, costo, cupo_total,
            fecha_creacion, (fecha_creacion + duracion) AS fecha_fin
     FROM curso
     WHERE estado = 'Activo'
     ORDER BY fecha_creacion`
  )
  return rows
}
