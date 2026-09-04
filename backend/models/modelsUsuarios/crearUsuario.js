import dataBase from '../../db/dataBase.js'
import bcrypt from 'bcryptjs'

export const postUsuario = async (user) => {
  const { usuario, password, role } = user
  const hashContracenia = await bcrypt.hash(password, 10)
  const datos = await dataBase.query(`
    INSERT INTO usuarios (email, password_hash, role)
    values ($1, $2, $3) RETURNING id_usuarios
    `, [usuario, hashContracenia, role])

  return datos.rows[0].id_usuarios
}
