import dataBase from '../../db/dataBase.js'

export const postPreInscripciones = async (req) => {
  const { nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, colegio } = req.body
  const informe = await dataBase.query(`
    INSERT INTO pre_inscripcion_estudiante(nombre, a_paterno, a_materno, ci, direccion, telefono, email, colegio)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `, [nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, colegio])
  return informe.rows[0]
}
