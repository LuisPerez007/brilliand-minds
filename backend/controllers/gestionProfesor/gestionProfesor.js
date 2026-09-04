import { mostrarCursoProfesor } from '../../models/modelsGestionProfesor/mostrarCursosProfesor.js'
import { mostrarEstudiantesProfesor } from '../../models/modelsGestionProfesor/mostrarEstudiantesProfesor.js'

export const getEstudiantesAsignados = async (req, res) => {
  try {
    const idUsuario = req.user.id
    const data = await mostrarEstudiantesProfesor(idUsuario)
    return res.status(200).json({ datos: data.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

export const getCursosAsignados = async (req, res) => {
  try {
    const idUsuario = req.user.id
    const data = await mostrarCursoProfesor(idUsuario)
    return res.status(200).json({ datos: data.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}
