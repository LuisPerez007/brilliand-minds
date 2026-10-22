import dataBase from '../../db/dataBase.js'

export const actualizarCurso = async (id, datos) => {
  const { nombre, descripcion, duracion, unidad, precio, cupos, fechaCreacion, idProfesor } = datos
  const duracionInterval = `${duracion} ${unidad}`
  const actualizar = await dataBase.query(
    'UPDATE curso SET nombre = $1, descripcion = $2, duracion = $3::interval, costo = $4, cupo_total = $5, fecha_creacion = $6, id_profesor = $7 WHERE id_curso = $8  RETURNING * ',
    [nombre, descripcion, duracionInterval, precio, cupos, fechaCreacion, idProfesor, id])
  console.log(actualizar.rows[0], ' se deberia actulizar cursos')
  return actualizar.rows[0]
}
