import dataBase from '../../../db/dataBase.js'

export const obtenerEvaluacionCurso = async (idUsuario, idCurso) => {
  const datos = await dataBase.query(`
    SELECT 
        cur.id_curso,
        cur.nombre AS curso,
        eva.id_evaluacion,
        eva.nombre_evaluacion,
        eva.descripcion, 
        eva.fecha_evaluacion,
        eva.porcentaje  
    FROM profesor pro
    JOIN curso cur ON cur.id_profesor = pro.id_profesor
    JOIN usuarios usu ON usu.id_usuarios = pro.id_usuario
    JOIN evaluacion eva ON eva.id_curso = cur.id_curso
    WHERE usu.id_usuarios = $1
    AND cur.id_curso = $2;
    `, [idUsuario, idCurso])

  return datos
}

export const crearEvaluacion = async (datos) => {
  const { idCurso, nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje, idUsuario } = datos
  const informe = await dataBase.query(`
    INSERT INTO evaluacion(id_curso, nombre_evaluacion, descripcion, fecha_evaluacion, porcentaje)
    SELECT $1, $2, $3, $4, $5 
    WHERE EXISTS (
    SELECT 1
    FROM  curso cur
    JOIN profesor pro
    ON pro.id_profesor = cur.id_profesor
    WHERE cur.id_curso = $1
    AND pro.id_usuario = $6
    )
    `, [idCurso, nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje, idUsuario])

  return informe.rowCount
}

export const actualizarEvaluacion = async (datos) => {
  const { idEvaluacion, idCurso, nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje, idUsuario } = datos
  const informe = await dataBase.query(`
    UPDATE evaluacion AS eva
    SET
      id_curso = $2,
      nombre_evaluacion = $3,
      descripcion = $4,
      fecha_evaluacion = $5,
      porcentaje = $6
    FROM curso cur
    JOIN profesor pro ON pro.id_profesor = cur.id_profesor
    WHERE eva.id_evaluacion = $1
      AND eva.id_curso = cur.id_curso
      AND pro.id_usuario = $7;
    `, [idEvaluacion, idCurso, nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje, idUsuario])
  return informe.rowCount
}

export const eliminarEvaluacion = async (datos) => {
  const { idEvaluacion, idUsuario } = datos
  const informe = await dataBase.query(`
    DELETE FROM evaluacion eva
    USING curso cur, profesor pro
    WHERE cur.id_curso = eva.id_curso
      AND pro.id_profesor = cur.id_profesor
      AND pro.id_usuario = $2
      AND eva.id_evaluacion = $1;
    
    `, [idEvaluacion, idUsuario])

  return informe.rowCount
}
