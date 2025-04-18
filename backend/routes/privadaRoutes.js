import express from 'express'
import { verificarToken } from '../middlewares/authMiddleware.js'

const route = express.Router()

route.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'token autorizado',
    usuario: req.usuario
  })
})

export default route
