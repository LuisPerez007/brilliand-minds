import dataBase from '../../db/dataBase.js'

export const mostrarCursos = async () => {
  const dataBaseCursos = await dataBase.query(`
    SELECT cu.*, 
    (pro.nombre || ' ' || pro.a_paterno) AS profesor_nombre,
    (cu.fecha_creacion + cu.duracion) AS fecha_fin
    FROM curso cu
    JOIN profesor pro ON pro.id_profesor = cu.id_profesor
    `)
  console.log(dataBaseCursos.rows)
  return dataBaseCursos.rows
}
