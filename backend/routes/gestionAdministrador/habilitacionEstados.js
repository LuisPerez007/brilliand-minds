import express from 'express'
import { putHabilitarUsuario } from '../../controllers/authController.js'

const router = express.Router()

router.put('/habilitar-usuario/:idUsuario', putHabilitarUsuario)

export default router
