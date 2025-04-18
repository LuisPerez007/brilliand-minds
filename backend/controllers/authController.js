import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import users from '../models/User.js'

dotenv.config({ path: './.env' })
const JWT_SECRET = process.env.JWT_SECRET || 'clase_secreta'

export const register = async (req, res) => {
  const { nombre, gmail, password } = req.body
  const existe = users.find(u => u.gmail === gmail)

  if (existe) {
    return res.status(400).json({ message: 'el usuario ya existe ' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = { id: users.length + 1, nombre, gmail, password: hashedPassword }
  users.push(newUser)

  res.status(201).json({ message: 'el usuario fue creado exitosamente ' })
}

export const login = async (req, res) => {
  const { gmail, password } = req.body
  const usuario = users.find(u => u.gmail === gmail)

  if (!usuario) {
    return res.status(404).json({ message: 'usuario no encontrado ' })
  }

  const passwordValida = await bcrypt.compare(password, usuario.password)

  if (!passwordValida) {
    return res.status(401).json({ message: 'Contraceña inconrrecta' })
  }

  const token = jwt.sign({ id: usuario.id, gmail: usuario.gmail }, JWT_SECRET, { expiresIn: '1h' })

  res.json({ message: 'login exitoso', token })
}
