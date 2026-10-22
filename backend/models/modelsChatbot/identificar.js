import dataBase from '../../db/dataBase.js'

export const buscarPorTelefono = async (telefono) => {
  const { rows } = await dataBase.query(
    `SELECT es.id_estudiante, es.nombre, es.a_paterno
     FROM estudiante es
     LEFT JOIN padre_tutor pt ON pt.id_tutor = es.id_tutor
     WHERE (pt.telefono = $1 AND pt.estado = 'Activo')
        OR es.telefono = $1`,
    [telefono]
  )
  return rows
}
