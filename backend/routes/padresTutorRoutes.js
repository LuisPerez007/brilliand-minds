import express from 'express'
import { getPadresTutors, postPadreTutor, putPadreTutor, deletePadreTutor } from '../controllers/padreTutorController.js'
import { validarCampos } from '../middlewares/validarCampos/validarCampos.js'
import { validarPadreTutor } from '../middlewares/padresValidacion/padresValidator.js'

const router = express.Router()
router.get('/padres-tutores', getPadresTutors)
router.post('/padres-tutores/registro', validarPadreTutor, validarCampos, postPadreTutor)
router.put('/padres-tutores/actualizar/:id', validarPadreTutor, validarCampos, putPadreTutor)
router.delete('/padres-tutores/eliminar/:id', deletePadreTutor)

export default router
