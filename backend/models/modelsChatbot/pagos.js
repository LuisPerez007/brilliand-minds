import dataBase from '../../db/dataBase.js'

export const estudianteDelTelefono = async (estudianteId, telefono) => {
  const { rows } = await dataBase.query(
    `SELECT id FROM estudiantes
     WHERE id = $1 AND (telefono = $2 OR telefono_tutor = $2)`,
    [estudianteId, telefono]
  )
  return rows.length > 0
}

export const obtenerPagos = async (estudianteId) => {
  const { rows } = await dataBase.query(
    `SELECT concepto, monto, estado, fecha_vencimiento
     FROM pagos
     WHERE estudiante_id = $1
     ORDER BY fecha_vencimiento DESC`,
    [estudianteId]
  )
  return rows
}
