export const crearInscripcion = async (db, datos) => {
  const { idEstudiante, idCurso } = datos
  const inscripcion = await db.query(`
        INSERT INTO inscripcion (id_estudiante, id_curso)
        VALUES ($1, $2) RETURNING * 
        `, [idEstudiante, idCurso])
  return inscripcion.rows[0]
}
