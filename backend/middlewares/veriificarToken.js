import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
    return res.status(401).json({ message: 'token no autorizado ' })
  }

  const token = header.split(' ')[1]

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET)
    req.user = usuario
    next()
  } catch (err) {
    return res.status(401).json({ message: 'token no  valido o expirado ' })
  }
}
