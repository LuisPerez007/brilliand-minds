import { Router } from 'express'
import { identificar, getPagos, getCursosActivos, getInscripcion } from '../../controllers/gestionChatbot/chatbot.controller.js'
import { obtenerCalificaciones } from '../../controllers/gestionChatbot/calificacionesChatbotController.js'

const router = Router()

router.get('/estudiantes/:id/calificaciones', obtenerCalificaciones)

router.get('/estudiantes/:id/inscripcion', getInscripcion)
router.post('/identificar', identificar)
router.get('/estudiantes/:id/pagos', getPagos)
router.get('/cursos', getCursosActivos)

export default router
