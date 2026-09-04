import express from 'express'
import { deleteEstudiante, getEstudiantes, postEstudiante, putEstudiante } from '../controllers/estudiantesController.js'
import { validarEstudiante } from '../middlewares/estudiantesValidacion/estudianteValidator.js'
import { validarCampos } from '../middlewares/validarCampos/validarCampos.js'
import { requireRole } from '../middlewares/requireRole.js'

const router = express.Router()

router.get('/estudiantes', requireRole('administrador'), getEstudiantes)
router.post('/estudiantes', validarEstudiante, validarCampos, postEstudiante)
router.put('/estudiantes/:id', validarEstudiante, validarCampos, putEstudiante)
router.delete('/estudiantes/:id', deleteEstudiante)

export default router
