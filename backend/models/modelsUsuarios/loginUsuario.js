import dataBase from '../../db/dataBase.js'

export const loginUsuario = async (email) => {
  const result = await dataBase.query('SELECT * FROM usuarios WHERE email = $1', [email])
  return result
}

export const habilitarUsuario = async (idUsuario) => {
  const informe = dataBase.query(`
    UPDATE usuarios
    SET estado = 'Activo'
    WHERE id_usuarios = $1
    `, [idUsuario])
  return informe
}
