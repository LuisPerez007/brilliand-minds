export const requireRole = (role) => {
  return (req, res, next) => {
    console.log('******************')
    console.log('URL:', req.method, req.originalUrl)
    console.log('ROL REQUERIDO:', role)
    console.log('ROL USUARIO:', req.user?.role)
    console.log('******************')
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado' })
    }
    next()
  }
}
