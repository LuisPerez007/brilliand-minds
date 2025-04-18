import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import route from './routes/privadaRoutes.js'

dotenv.config({ path: './.env' })
const app = express()
const puerto = process.env.PORT ?? 5000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  console.log('respondido')
  res.send('HOLA DESDE EXPRESS')
})

app.use('/', authRoutes)
app.use('/', route)

app.listen(puerto, () => {
  console.log(`el puerto esta escuchando en el puerto http://localhost:${puerto}`)
})
