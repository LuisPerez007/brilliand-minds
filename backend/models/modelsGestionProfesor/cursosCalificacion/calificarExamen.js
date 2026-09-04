import dataBase from '../../../db/dataBase.js'

export const calificarExamen = async (datos) => {
  const { idEvaluacion, idInscripcion, nota, observacion, idEstudiante, idUsuario } = datos
  const resultado = await dataBase.query(`
        INSERT INTO calificacion ( id_evaluacion, id_inscripcion, nota, observacion, id_estudiante)
        SELECT $1, $2, $3, $4, $5
        WHERE EXISTS (select 1
        FROM evaluacion eva
        JOIN curso cur ON cur.id_curso = eva.id_curso
        JOIN profesor pro ON pro.id_profesor = cur.id_profesor
        WHERE eva.id_evaluacion = $1
          AND pro.id_usuario = $6)
        `
  , [idEvaluacion, idInscripcion, nota, observacion, idEstudiante, idUsuario])

  return resultado.rowCount
}

export const EditarExamen = async (datos) => {
  const { idEvaluacion, idInscripcion, idCalificacion, nota, observacion, idEstudiante, idUsuario } = datos
  const resultado = await dataBase.query(`
        UPDATE calificacion cal
        SET
            id_evaluacion = $1,
            id_inscripcion = $2,
            nota = $4,
            observacion = $5,
            id_estudiante = $6
        WHERE cal.id_calificacion = $3
          AND EXISTS (
            SELECT 1
            FROM evaluacion eva
            JOIN curso cur
              ON cur.id_curso = eva.id_curso
            JOIN profesor pro
              ON pro.id_profesor = cur.id_profesor
            WHERE eva.id_evaluacion = $1
              AND pro.id_usuario = $7
          );
        `
  , [idEvaluacion, idInscripcion, idCalificacion, nota, observacion, idEstudiante, idUsuario])

  return resultado.rowCount
}
