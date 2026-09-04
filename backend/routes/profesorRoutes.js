import express from 'express'
import { getProfesor, postProfesor, putProfesor, deleteProfesor } from '../controllers/profesorController.js'
import { validarProfesor } from '../middlewares/profesorValidacion/profesorValidator.js'
import { validarCampos } from '../middlewares/validarCampos/validarCampos.js'

const router = express.Router()

router.get('/profesor', getProfesor)
router.post('/profesor', validarProfesor, validarCampos, postProfesor)
router.put('/profesor/:id', validarProfesor, validarCampos, putProfesor)
router.delete('/profesor/:id', deleteProfesor)

export default router
