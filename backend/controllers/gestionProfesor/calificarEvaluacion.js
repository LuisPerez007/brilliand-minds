import { calificarExamen, EditarExamen, examenesYaCalificados } from '../../models/modelsGestionProfesor/cursosCalificacion/calificarExamen.js'

export const getMostrarExamenesCalificados = async (req, res) => {
  try {
    console.log('req.user:', req.user)
    if (!req.user || req.user.role !== 'profesor') {
      return res.status(403).json({ message: 'No tienes permiso para ver evaluaciones' })
    }
    const { idCurso } = req.params
    const examenes = await examenesYaCalificados(idCurso)
    return res.status(200).json({ examenes })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const postCalificarEvaluacion = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'profesor') {
      return res.status(403).json({ message: 'No tienes permiso para calificar evaluaciones' })
    }

    const datos = { ...req.body, idUsuario: req.user.id }
    const informe = await calificarExamen(datos)
    if (informe === 0) {
      return res.status(400).json({ message: 'Error al insertar calificacion' })
    }
    return res.status(200).json({ message: 'Calificacion insertada correctamente' })
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'El estudiante ya tiene una calificación para esta evaluación'
      })
    }
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const putCalificarEvaluacion = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'profesor') {
      return res.status(403).json({ message: 'No tienes permiso para calificar evaluaciones' })
    }
    const datos = { ...req.body, idUsuario: req.user.id }
    const informe = await EditarExamen(datos)
    if (informe === 0) {
      return res.status(404).json({ message: 'La calificacion no existe, o no tienes permiso para actualizarla' })
    }
    return res.status(200).json({ message: 'Calificacion actualizada correctamente' })
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ya existe un registro con esos datos' })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
