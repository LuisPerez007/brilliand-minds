import crypto from 'node:crypto'

const obtenerClave = () => {
  const secreto = process.env.RECIBO_VERIFICACION_SECRET

  if (!secreto) {
    throw new Error('Falta RECIBO_VERIFICACION_SECRET en las variables de entorno')
  }

  return crypto.createHash('sha256').update(secreto).digest()
}

export const crearTokenRecibo = (idRecibo) => {
  const iv = crypto.randomBytes(12)
  const cifrador = crypto.createCipheriv('aes-256-gcm', obtenerClave(), iv)
  const contenido = cifrador.update(String(idRecibo), 'utf8', 'base64url') + cifrador.final('base64url')
  const autenticacion = cifrador.getAuthTag().toString('base64url')

  return `${iv.toString('base64url')}.${autenticacion}.${contenido}`
}

export const obtenerIdDesdeTokenRecibo = (token) => {
  try {
    const [ivCodificado, autenticacionCodificada, contenidoCodificado] = String(token).split('.')
    const iv = Buffer.from(ivCodificado, 'base64url')
    const autenticacion = Buffer.from(autenticacionCodificada, 'base64url')
    const descifrador = crypto.createDecipheriv('aes-256-gcm', obtenerClave(), iv)
    descifrador.setAuthTag(autenticacion)
    const idRecibo = descifrador.update(contenidoCodificado, 'base64url', 'utf8') + descifrador.final('utf8')
    const idNumerico = Number(idRecibo)

    return Number.isInteger(idNumerico) && idNumerico > 0 ? idNumerico : null
  } catch {
    return null
  }
}
