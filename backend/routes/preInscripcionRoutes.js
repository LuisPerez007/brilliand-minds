import { Router } from 'express'
import { posPreinscripcionRechazada, getPreinscripcionEstudiante, postPreinscripcionEstudiante, posPreinscripcionAprobada } from '../controllers/preInscripcionEstudianteController.js'
import { validarEstudiante } from '../middlewares/estudiantesValidacion/estudianteValidator.js'
import { validarCampos } from '../middlewares/validarCampos/validarCampos.js'

import { verificarToken } from '../middlewares/veriificarToken.js'
import { requireRole } from '../middlewares/requireRole.js'

const router = Router()

router.post('/preinscripcion/estudiante', validarEstudiante, validarCampos, postPreinscripcionEstudiante)
router.get('/admin/preinscripcion/lista', verificarToken, requireRole('administrador'), getPreinscripcionEstudiante)
router.post('/admin/preinscripcion/rechazado/:idSolicitud', verificarToken, requireRole('administrador'), posPreinscripcionRechazada)
router.post('/admin/preinscripcion/aceptada/:idSolicitud', verificarToken, requireRole('administrador'), posPreinscripcionAprobada)

export default router
