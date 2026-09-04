import { Router } from 'express'
import { deleteinscripcionPorEstudiante, deleteInscripcionPorId, mostrarInscripcionPorEstudiante, getInscripciones, getInscripcionesPorCurso, getInscripcionesPorProfesor, postInscripciones } from '../controllers/inscripcioncontroller.js'
import { validarInscripcion } from '../middlewares/inscripcionValidacion/inscripcionValidator.js'
import { validarCampos } from '../middlewares/validarCampos/validarCampos.js'
import { getControlDePagosEstudiante, putMarcarInscripcionComoPagada } from '../controllers/controlDePagosEstudiante.js'

const router = Router()

router.get('/inscripciones', getInscripciones)
router.get('/inscripciones/curso/:id', getInscripcionesPorCurso)
router.get('/inscripciones/profesor/:id', getInscripcionesPorProfesor)
router.post('/inscripciones', validarInscripcion, validarCampos, postInscripciones)
router.get('/inscripciones/estudiante/:id', mostrarInscripcionPorEstudiante)
router.delete('/inscripciones/:id', deleteInscripcionPorId)
router.delete('/inscripciones/:id/estudiante', deleteinscripcionPorEstudiante)

router.get('/inscripciones/control-pagos', getControlDePagosEstudiante)
router.put('/inscripciones/marcar-pagado/:idInscripcion', putMarcarInscripcionComoPagada)

export default router
