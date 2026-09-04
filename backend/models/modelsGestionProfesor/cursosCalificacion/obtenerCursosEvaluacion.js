import dataBase from '../../../db/dataBase.js'

export const obtenerCursosEvaluacion = async (idUsuario) => {
  const datos = await dataBase.query(`
    SELECT cur.nombre AS curso, cur.id_curso
    FROM profesor pro
    JOIN curso cur ON cur.id_profesor = pro.id_profesor
    JOIN usuarios usu ON usu.id_usuarios = pro.id_usuario
    WHERE usu.id_usuarios = $1;
    `, [idUsuario])

  return datos
}
