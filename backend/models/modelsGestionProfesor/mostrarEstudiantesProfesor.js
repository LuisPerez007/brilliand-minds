import dataBase from '../../db/dataBase.js'

export const mostrarEstudiantesProfesor = async (idUsuario) => {
  const datos = await dataBase.query(`
    SELECT 
    ins.id_inscripcion, 
    (est.nombre||' '||est.a_paterno||' '||est.a_materno) AS estudiante,
    cur.nombre AS curso,
    est.telefono AS telefono_estudiante,
    est.direccion,
    ins.fecha_inscripcion
    FROM profesor pro
    JOIN usuarios usu ON usu.id_usuarios = pro.id_usuario
    LEFT JOIN curso cur ON pro.id_profesor = cur.id_profesor
    LEFT JOIN inscripcion ins ON ins.id_curso = cur.id_curso
    LEFT JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
    WHERE usu.id_usuarios = $1
    ORDER BY cur.nombre, ins.fecha_inscripcion   
  `, [idUsuario])
  return datos
}
