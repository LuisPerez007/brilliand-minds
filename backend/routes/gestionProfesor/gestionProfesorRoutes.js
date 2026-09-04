import express from 'express'
import { getCursosAsignados, getEstudiantesAsignados } from '../../controllers/gestionProfesor/gestionProfesor.js'
import { deleteEvaluacionDeunCurso, getCursosEvaluacion, getEvaluacionCurso, getListarCalificacionesEvaluacion, postCrearEvaluacionAunCurso, putActualizarEvaluacionDeunCurso } from '../../controllers/gestionProfesor/evaluacion.js'
import { postCalificarEvaluacion, putCalificarEvaluacion } from '../../controllers/gestionProfesor/calificarEvaluacion.js'
import { validarCalificacion } from '../../middlewares/gestionProfesor/calificacionValidacion/calificacionValidator.js'
import { validarCampos } from '../../middlewares/validarCampos/validarCampos.js'
import { validarEvaluacion } from '../../middlewares/gestionProfesor/evaluacionValidacion/evaluacionValidator.js'

const router = express.Router()
router.get('/cursos', getCursosAsignados)
router.get('/estudiantes', getEstudiantesAsignados)
router.get('/cursos/evaluacion', getCursosEvaluacion)
router.get('/cursos/evaluacion/examen/:idCurso', getEvaluacionCurso)
router.post('/cursos/evaluacion/examen/crearEvaluacion', validarEvaluacion, validarCampos, postCrearEvaluacionAunCurso)
router.put('/cursos/evaluacion/examen/editarEvaluacion', validarEvaluacion, validarCampos, putActualizarEvaluacionDeunCurso)
router.delete('/cursos/evaluacion/examen/eliminarEvaluacion/:idEvaluacion', deleteEvaluacionDeunCurso)

router.get('/cursos/evaluacion/examen/listarCalificaciones/:idCurso/:idEvaluacion', getListarCalificacionesEvaluacion)
router.post('/cursos/evaluacion/examen/listarCalificaciones/calificarExamen', validarCalificacion, validarCampos, postCalificarEvaluacion)
router.put('/cursos/evaluacion/examen/listarCalificaciones/editarExamen', validarCalificacion, validarCampos, putCalificarEvaluacion)

export default router
