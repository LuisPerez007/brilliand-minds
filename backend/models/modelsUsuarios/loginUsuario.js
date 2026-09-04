import dataBase from '../../db/dataBase.js'

export const loginUsuario = async (email) => {
  const result = await dataBase.query('SELECT * FROM usuarios WHERE email = $1', [email])
  return result
}
