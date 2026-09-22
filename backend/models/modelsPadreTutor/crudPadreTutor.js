import dataBase from '../../db/dataBase.js'

export const obtenerPadresTutors = async () => {
  const informe = await dataBase.query(`
    SELECT * FROM padre_tutor
    ORDER BY nombre ASC`)
  return informe
}

export const registrarPadreTutor = async (data) => {
  const { nombre, apellidoPaterno, apellidoMaterno, ci, telefono, direccion } = data
  const resultado = await dataBase.query(`
    INSERT INTO padre_tutor (nombre, a_paterno, a_materno, ci, telefono, direccion) 
    VALUES ($1, $2, $3, $4, $5, $6)`
  , [nombre, apellidoPaterno, apellidoMaterno, ci, telefono, direccion])
  return resultado
}

export const actualizarPadreTutor = async (id, data) => {
  const { nombre, apellidoPaterno, apellidoMaterno, ci, telefono, direccion } = data
  const resultado = await dataBase.query(`
    UPDATE padre_tutor 
    SET 
    nombre = $1, 
    a_paterno = $2, 
    a_materno = $3, 
    ci = $4, 
    telefono = $5, 
    direccion = $6
    WHERE id_tutor = $7`
  , [nombre, apellidoPaterno, apellidoMaterno, ci, telefono, direccion, id])
  return resultado
}

export const eliminarPadreTutor = async (id) => {
  const resultado = await dataBase.query(`
    DELETE FROM padre_tutor
    WHERE id_tutor = $1`, [id])
  return resultado
}
