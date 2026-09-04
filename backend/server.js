import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import autorizacionRoutes from './routes/autorizacionRoutes.js'
import route from './routes/privadaRoutes.js'

import estudiantesRoutes from './routes/estudiantesRoutes.js'
import cursosRoutes from './routes/cursosRoutes.js'
import profesorRoutes from './routes/profesorRoutes.js'
import inscripcionRoutes from './routes/inscripcionRoutes.js'
import preInscripcionRoutes from './routes/preInscripcionRoutes.js'

import gestionProfesorRoutes from './routes/gestionProfesor/gestionProfesorRoutes.js'
import gestionEstudianteRoutes from './routes/gestionEstudiante/gestionEstudianteRoutes.js'

import { verificarToken } from './middlewares/veriificarToken.js'
import { requireRole } from './middlewares/requireRole.js'

dotenv.config({ path: './.env' })
const app = express()
const puerto = process.env.PORT ?? 5000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  console.log('respondido')
  res.send('HOLA DESDE EXPRESS')
})

app.use('/', route)

app.use('/', autorizacionRoutes)
app.use('/', preInscripcionRoutes)
app.use('/admin', verificarToken, requireRole('administrador'), estudiantesRoutes)
app.use('/admin', verificarToken, requireRole('administrador'), cursosRoutes)
app.use('/admin', verificarToken, requireRole('administrador'), profesorRoutes)
app.use('/admin', verificarToken, requireRole('administrador'), inscripcionRoutes)

app.use('/docente', verificarToken, requireRole('profesor'), gestionProfesorRoutes)
app.use('/estudiante', verificarToken, requireRole('estudiante'), gestionEstudianteRoutes)

app.listen(puerto, () => {
  console.log(
    `el puerto esta escuchando en el puerto http://localhost:${puerto}`
  )
})
