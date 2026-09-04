import { mostrarPreinscripcionEstudiante } from '../models/modelsPreInscripcion/mostrandoPreinscripcion.js'
import { preinscripcionAceptada } from '../models/modelsPreInscripcion/preinscripcionAceptada.js'
import { postPreInscripciones } from '../models/modelsPreInscripcion/preInscripcionEstudiante.js'
import { preinscripcionRechazada } from '../models/modelsPreInscripcion/preinscripcionRechazada.js'

export const posPreinscripcionAprobada = async (req, res) => {
  try {
    const { idSolicitud } = req.params
    const result = await preinscripcionAceptada(idSolicitud)
    if (result === 0) {
      return res.status(404).json({ message: 'No se encontro la solicitud' })
    }
    return res.status(200).json({ message: 'Solicitud Aceptado correctamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const posPreinscripcionRechazada = async (req, res) => {
  try {
    const { idSolicitud } = req.params
    const result = await preinscripcionRechazada(idSolicitud)
    if (result === 0) {
      return res.status(404).json({ message: 'No se encontro la solicitud' })
    }
    return res.status(200).json({ message: 'Solicitud Rechazada correctamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const getPreinscripcionEstudiante = async (req, res) => {
  try {
    const listaPreinscripcion = await mostrarPreinscripcionEstudiante()

    return res.status(200).json(listaPreinscripcion)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const postPreinscripcionEstudiante = async (req, res) => {
  try {
    const datos = await postPreInscripciones(req)
    if (!datos) {
      return res.status(400).json({ message: 'No se pudo registrar la preinscripcion' })
    }
    console.log(datos, 'mostrando los datos preinscripcion')
    return res.status(201).json('Datos enviado al administrador')
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Ya existe una preinscripción con ese CI.' })
    }
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}
