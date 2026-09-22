import express from 'express'
import { login, refreshToken } from '../controllers/authController.js'
import { limitadorLogin } from '../middlewares/publicValidaciones/publicLimiter.js'

const router = express.Router()

router.post('/login', limitadorLogin, login)
router.post('/refresh', refreshToken)

export default router
