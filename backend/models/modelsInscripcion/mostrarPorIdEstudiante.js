import dataBase from '../../db/dataBase.js'

export const mostrarInscripcionesPorEstudiante = async (id) => {
  const mostrar = await dataBase.query(`SELECT cu.nombre, cu.id_curso AS id_curso
FROM estudiante AS es
JOIN inscripcion ins ON ins.id_estudiante = es.id_estudiante
JOIN curso cu ON cu.id_curso = ins.id_curso
WHERE es.id_estudiante = $1`, [id])
  return mostrar
}
