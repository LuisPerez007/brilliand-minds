import dataBase from '../../db/dataBase.js'

export const obtenerPadresTutors = async () => {
  const informe = await dataBase.query(`
    SELECT * FROM padre_tutor
    ORDER BY id_tutor DESC`)
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

export const cambiarEstadoPadreTutor = async (id, estado) => {
  const resultado = await dataBase.query(`
    UPDATE padre_tutor
    SET estado = $1
    WHERE id_tutor = $2`, [estado, id])
  return resultado
}

export const obtenerTipoEstadoPadreTutor = async (id) => {
  const resultado = await dataBase.query(`
    SELECT estado FROM padre_tutor
    WHERE id_tutor = $1`, [id])
  return resultado
}
