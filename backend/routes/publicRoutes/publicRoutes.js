import express from 'express'
import { getVerificarRecibo } from '../../controllers/controlDePagosEstudiante.js'
import { getCursosDisponibles } from '../../controllers/publicasControllers/mostrandoCursosParaPortal.js'
import { limitadorPublico } from '../../middlewares/publicValidaciones/publicLimiter.js'

const router = express.Router()

router.get('/cursos-disponibles', limitadorPublico, getCursosDisponibles)
router.get('/verificar-recibo/:token', limitadorPublico, getVerificarRecibo)

export default router
