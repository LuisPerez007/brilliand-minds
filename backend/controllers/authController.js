import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { loginUsuario } from '../models/modelsUsuarios/loginUsuario.js'

dotenv.config({ path: './.env' })

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await loginUsuario(email)

    if (!result.rows.length) {
      return res.status(400).json({ message: 'Usuario no existe o credenciales inválidas' })
    }

    const usuario = result.rows[0]
    const passwordValida = await bcrypt.compare(password, usuario.password_hash)

    if (!passwordValida) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrecta' })
    }

    const token = jwt.sign(
      { id: usuario.id_usuarios, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    )

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
