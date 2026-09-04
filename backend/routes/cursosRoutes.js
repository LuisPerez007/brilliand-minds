import express from 'express'
import { getCursos, postCursos, putCursos, deleteCurso } from '../controllers/cursosController.js'
import { validarCurso } from '../middlewares/cursosValidacion/cursosValidator.js'
import { validarCampos } from '../middlewares/validarCampos/validarCampos.js'

const router = express.Router()

router.get('/cursos', getCursos)
router.post('/cursos', validarCurso, validarCampos, postCursos)
router.put('/cursos/:id', validarCurso, validarCampos, putCursos)
router.delete('/cursos/:id', deleteCurso)

export default router
