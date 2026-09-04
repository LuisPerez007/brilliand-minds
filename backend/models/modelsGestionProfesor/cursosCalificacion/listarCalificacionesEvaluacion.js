import dataBase from '../../../db/dataBase.js'

export const listarCalificacionesEvaluacion = (idUsuario, idCurso, idEvaluacion) => {
  const datos = dataBase.query(`
    SELECT
    ins.id_inscripcion,
    cal.id_calificacion,
    pro.nombre || ' ' || pro.a_paterno || ' ' || pro.a_materno AS profesor,
    est.id_estudiante,
    est.nombre || ' ' || est.a_paterno || ' ' || est.a_materno AS estudiante,
    cur.id_curso,
    cur.nombre AS curso,
    eva.id_evaluacion,
    eva.nombre_evaluacion AS evaluacion,
    eva.descripcion,
    eva.fecha_evaluacion,
    cal.nota,
    cal.observacion,
    eva.porcentaje
    FROM estudiante est
    JOIN inscripcion ins
        ON ins.id_estudiante = est.id_estudiante
    JOIN curso cur
        ON cur.id_curso = ins.id_curso
    JOIN profesor pro
        ON pro.id_profesor = cur.id_profesor
    JOIN usuarios usu
        ON usu.id_usuarios = pro.id_usuario
    JOIN evaluacion eva
        ON eva.id_curso = cur.id_curso
    LEFT JOIN calificacion cal
        ON cal.id_evaluacion = eva.id_evaluacion
        AND cal.id_estudiante = est.id_estudiante
    WHERE usu.id_usuarios = $1
        AND cur.id_curso = $2
        AND eva.id_evaluacion = $3
    ORDER BY est.id_estudiante;       
        `, [idUsuario, idCurso, idEvaluacion])
  return datos
}
