import express from 'express'
import { getMostrarCalificaionesDelEstudiante, getMostrarCursosNoInscritosDelEstudiante, getMostrarcursosParaEstudiantes, postCrearInscripcionAunCursoestudiante } from '../../controllers/gestionEstudiante/cursosParaEstudiantes.js'

const router = express.Router()
router.get('/cursos', getMostrarcursosParaEstudiantes)
router.get('/curso/calificaciones/:idCurso', getMostrarCalificaionesDelEstudiante)
router.get('/curso/no-inscritos', getMostrarCursosNoInscritosDelEstudiante)
router.post('/curso/inscripcion-a-un-curso/:idCurso', postCrearInscripcionAunCursoestudiante)

export default router
