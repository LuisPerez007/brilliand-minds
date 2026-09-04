import dataBase from '../../db/dataBase.js'

export const mostrarInscripcionPorCurso = async (id) => {
  const result = await dataBase.query(`SELECT 
ins.id_inscripcion,
ins.fecha_inscripcion,
cur.nombre AS curso,
(pro.nombre ||' '||pro.a_paterno||' '||pro.a_materno) AS profesor,
pro.telefono AS telefono_profesor,
(est.nombre||' '||est.a_paterno||' '||est.a_materno) AS estudiante,
est.telefono AS telefono_estudiante
FROM curso cur
JOIN inscripcion ins ON ins.id_curso = cur.id_curso
JOIN profesor pro ON pro.id_profesor = cur.id_profesor
JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
WHERE cur.id_curso = $1`, [id])
  return result
}
