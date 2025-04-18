import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta'

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'token no proporcionado ' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decodet = jwt.verify(token, JWT_SECRET)
    req.usuario = decodet
    next()
  } catch (err) {
    res.status(200).json({ message: 'token no  valido o expirado ' })
  }
}
