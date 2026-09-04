import dataBase from '../../db/dataBase.js'

export const mostrarInscripcionesPorProfesor = async (id) => {
  const informe = await dataBase.query(`SELECT 
cur.id_curso,
ins.id_inscripcion, 
ins.fecha_inscripcion,
(pro.nombre||' '||pro.a_paterno||' '||pro.a_materno) AS profesor,
pro.telefono AS telefono_profesor,
(est.nombre||' '||est.a_paterno||' '||est.a_materno) AS estudiante,
est.telefono AS telefono_estudiante,
cur.nombre AS curso
FROM profesor pro
 JOIN curso cur ON pro.id_profesor = cur.id_profesor
LEFT JOIN inscripcion ins ON ins.id_curso = cur.id_curso
LEFT JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
WHERE pro.id_profesor = $1
ORDER BY cur.nombre, ins.fecha_inscripcion`, [id])
  return (informe)
}
