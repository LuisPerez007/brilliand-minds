import cors from 'cors'

const frontendURL = process.env.NODE_ENV === 'production'
  ? 'https://tu-academia-frontend.com' // 🌐 Tu dominio real en producción
  : 'http://localhost:3000' // 💻 Tu entorno local de desarrollo

const opcionesCors = {
  origin: frontendURL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 🔒 Agregamos PUT y DELETE para que tus formularios de edición funcionen bien
  optionsSuccessStatus: 200,
  credentials: true // Permite el envío de cookies/tokens si lo necesitas en el futuro
}

// Exportamos el middleware ya configurado listo para usar
export const configurarCors = cors(opcionesCors)
