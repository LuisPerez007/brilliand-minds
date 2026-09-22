import db from '../../db/dataBase.js'

export const mostrarPreinscripcionEstudiante = async () => {
  const data = await db.query(`
    SELECT id_solicitud AS id, 
    ( nombre||' ' ||a_paterno||' '||a_materno) AS nombre,
    colegio, 
    ci, direccion, telefono, email, fecha_solicitud, estado, observacion 
    FROM pre_inscripcion_estudiante
    WHERE estado = 'Pendiente'
    ORDER BY fecha_solicitud DESC
    `)
  return data.rows
}
