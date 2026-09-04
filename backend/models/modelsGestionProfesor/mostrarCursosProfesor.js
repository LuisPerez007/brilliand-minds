import dataBase from '../../db/dataBase.js'

export const mostrarCursoProfesor = async (idProfesor) => {
  const datos = await dataBase.query(`
    SELECT 
    cu.id_curso,
    cu.nombre AS materia,
    cu.descripcion,
    cu.duracion,
    cu.fecha_creacion,
    (cu.fecha_creacion + cu.duracion) AS fecha_fin,
    COUNT(est.id_estudiante) AS cantidad_estudiantes
    FROM usuarios us
    JOIN profesor pro ON pro.id_usuario = us.id_usuarios
    JOIN curso cu ON cu.id_profesor = pro.id_profesor
    LEFT JOIN inscripcion ins ON ins.id_curso = cu.id_curso
    LEFT JOIN estudiante est ON est.id_estudiante = ins.id_estudiante
    WHERE us.id_usuarios = $1
    GROUP BY 
    cu.id_curso,
    cu.nombre,
    cu.descripcion,
    cu.duracion,
    cu.fecha_creacion;
        `, [idProfesor])

  return datos
}
