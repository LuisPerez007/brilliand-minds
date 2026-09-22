import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { loginUsuario } from '../models/modelsUsuarios/loginUsuario.js'

dotenv.config({ path: './.env' })

const crearAccessToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id_usuarios, email: usuario.email, role: usuario.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '10m'
    }
  )
}

const crearRefreshToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id_usuarios, email: usuario.email, role: usuario.role, type: 'refresh' },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

const guardarRefreshTokenEnCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  })
}

const leerCookie = (req, nombre) => {
  const cookies = req.headers.cookie || ''
  const valor = cookies
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${nombre}=`))

  if (!valor) return null

  return decodeURIComponent(valor.split('=').slice(1).join('='))
}

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

    const token = crearAccessToken(usuario)
    const refreshToken = crearRefreshToken(usuario)

    guardarRefreshTokenEnCookie(res, refreshToken)

    return res.json({ token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

export const refreshToken = (req, res) => {
  try {
    const tokenCookie = leerCookie(req, 'refreshToken')

    if (!tokenCookie) {
      return res.status(401).json({ message: 'Refresh token no disponible' })
    }

    const payload = jwt.verify(tokenCookie, process.env.JWT_SECRET)

    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Refresh token inválido' })
    }

    const usuario = {
      id_usuarios: payload.id,
      email: payload.email,
      role: payload.role
    }

    const nuevoAccessToken = crearAccessToken(usuario)
    const nuevoRefreshToken = crearRefreshToken(usuario)

    guardarRefreshTokenEnCookie(res, nuevoRefreshToken)

    return res.json({ token: nuevoAccessToken })
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido o expirado' })
  }
}
