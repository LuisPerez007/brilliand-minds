import rateLimiter from 'express-rate-limit'

export const limitadorPublico = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

export const limitadorLogin = rateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: {
    message: 'Demasiadas solicitudes de inicio de sesión desde esta IP, por favor intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
})

export const limitadorFormularioInscripcion = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    message: 'Demasiadas solicitudes de inscripción desde esta IP, por favor intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false
})
