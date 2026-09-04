import dataBase from '../../db/dataBase.js'

export const crearCursos = async (datos) => {
  const { nombre, descripcion, duracion, unidad, precio, cupos, idProfesor } = datos
  const duracionInterval = `${duracion} ${unidad}`
  const resultado = await dataBase.query(
    `INSERT INTO curso (nombre, descripcion, duracion, costo, cupo_total, id_profesor) 
    VALUES  ( $1, $2, $3::interval, $4, $5, $6) RETURNING *`,
    [nombre, descripcion, duracionInterval, precio, cupos, idProfesor]
  )
  console.log(resultado.rows, 'LLEGO HASTA CURSOS Y DEBERIA ESTAR LA BASE DE DATOS DE CURSO')
  return resultado.rows[0]
}
