import { obtenerDeudasEstudiante, crearInscripcionAunCurso, obtenerCalificacionesDelEstudiante, obtenerCursosNoInscritosDelEstudiante, obtenerCursosParaEstudiante, obtenerEstudiante } from '../../models/modelsGestionEstudiante/cursosEstudiante/obtenerCursosEstudiante.js'

export const getMostrarDeudasEstudiante = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'estudiante') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los estudiantes pueden acceder a esta información.' })
    }
    const informe = await obtenerDeudasEstudiante(req.user.id)
    return res.status(200).json({ datos: informe.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const getMostrarcursosParaEstudiantes = async (req, res) => {
  try {
    const idUsuario = req.user.id
    const informe = await obtenerCursosParaEstudiante(idUsuario)
    return res.status(200).json({ datos: informe.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const getMostrarCalificaionesDelEstudiante = async (req, res) => {
  try {
    const { idCurso } = req.params
    const informe = await obtenerCalificacionesDelEstudiante(idCurso, req.user.id)
    return res.status(200).json({ datos: informe.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const getMostrarCursosNoInscritosDelEstudiante = async (req, res) => {
  try {
    const idUsuario = req.user.id
    const informe = await obtenerCursosNoInscritosDelEstudiante(idUsuario)
    return res.status(200).json({ datos: informe.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const postCrearInscripcionAunCursoestudiante = async (req, res) => {
  try {
    const { idCurso } = req.params
    const idUsuario = req.user.id
    const idEstudiante = await obtenerEstudiante(idUsuario)
    const informe = await crearInscripcionAunCurso(idEstudiante, idCurso)
    if (informe.rowCount === 0) {
      return res.status(400).json({ message: 'No se pudo realizar la inscripción' })
    }
    return res.status(201).json({ message: 'Inscripción realizada correctamente' })
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Ya estás inscrito en este curso' })
    }
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}
