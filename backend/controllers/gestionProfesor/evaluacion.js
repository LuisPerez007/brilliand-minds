import { listarCalificacionesEvaluacion } from '../../models/modelsGestionProfesor/cursosCalificacion/listarCalificacionesEvaluacion.js'
import { obtenerCursosEvaluacion } from '../../models/modelsGestionProfesor/cursosCalificacion/obtenerCursosEvaluacion.js'
import { actualizarEvaluacion, crearEvaluacion, eliminarEvaluacion, obtenerEvaluacionCurso } from '../../models/modelsGestionProfesor/cursosCalificacion/obtenerEvaluacionCurso.js'

export const getListarCalificacionesEvaluacion = async (req, res) => {
  try {
    const idUsuario = req.user.id
    const { idCurso, idEvaluacion } = req.params
    console.log(`idUsuario: ${idUsuario}  idCurso: ${idCurso} idEvaluacion: ${idEvaluacion}`)
    const data = await listarCalificacionesEvaluacion(idUsuario, idCurso, idEvaluacion)
    return res.status(200).json({ datos: data.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

export const getEvaluacionCurso = async (req, res) => {
  try {
    const idUsuario = req.user.id
    console.log(`mostrando usuario sin mandar del frontend ${idUsuario}`)
    const { idCurso } = req.params
    const data = await obtenerEvaluacionCurso(idUsuario, idCurso)
    return res.status(200).json({ datos: data.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

export const postCrearEvaluacionAunCurso = async (req, res) => {
  try {
    const datos = { ...req.body, idUsuario: req.user.id }
    const informe = await crearEvaluacion(datos)
    if (informe === 0) {
      return res.status(400).json({ message: 'Error al crear evaluacion' })
    }
    return res.status(201).json({ message: 'Evaluacion creada correctamente' })
  } catch (error) {
    console.error(error)
    if (error.code === 23505) {
      return res.status(409).json({ message: 'Ya existe una evaluacion para este curso' })
    }
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const putActualizarEvaluacionDeunCurso = async (req, res) => {
  try {
    const datos = { ...req.body, idUsuario: req.user.id }
    const informe = await actualizarEvaluacion(datos)
    if (informe === 0) {
      return res.status(404).json({ message: 'No se encontró la evaluación o no pertenece al profesor' })
    }
    return res.status(200).json({ message: 'Evaluacion actualizada correctamente' })
  } catch (error) {
    console.error(error)
    if (error.code === 23505) {
      return res.status(409).json({ message: 'Ya existe una evaluacion para este curso' })
    }
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const deleteEvaluacionDeunCurso = async (req, res) => {
  try {
    const { idEvaluacion } = req.params
    const datos = { idEvaluacion, idUsuario: req.user.id }
    const informe = await eliminarEvaluacion(datos)
    if (informe === 0) {
      return res.status(404).json({ message: 'No se encontró la evaluación para eliminar o no pertenece al profesor' })
    }
    return res.status(200).json({ message: 'Evaluacion eliminada correctamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

export const getCursosEvaluacion = async (req, res) => {
  try {
    const idUsuario = req.user.id
    const data = await obtenerCursosEvaluacion(idUsuario)
    return res.status(200).json({ datos: data.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}
