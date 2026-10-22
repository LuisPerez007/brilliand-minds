import { buscarPorTelefono } from '../../models/modelsChatbot/identificar.js'
import { estudianteDelTelefono, obtenerPagos } from '../../models/modelsChatbot/pagos.js'

import { cursosActivos } from '../../models/modelsChatbot/cursos.js'

import { inscripcionesDelEstudiante } from '../../models/modelsChatbot/inscripcionesDelEstudiante.js'

export const getInscripcion = async (req, res) => {
  try {
    const { id } = req.params
    const { telefono } = req.query

    if (!telefono) {
      return res.status(400).json({ ok: false, message: 'Falta el teléfono' })
    }

    // Seguridad: el estudiante debe pertenecer a ese teléfono
    const estudiantes = await buscarPorTelefono(telefono)
    const estudiante = estudiantes.find((e) => String(e.id_estudiante) === String(id))
    if (!estudiante) {
      return res.status(403).json({ ok: false, message: 'Este estudiante no pertenece a este número' })
    }

    const inscripciones = await inscripcionesDelEstudiante(id)
    return res.json({
      ok: true,
      estudiante: { nombre: estudiante.nombre, a_paterno: estudiante.a_paterno },
      inscripciones
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Error interno servidor' })
  }
}

export const getCursosActivos = async (req, res) => {
  try {
    const cursos = await cursosActivos()
    return res.json({ ok: true, cursos })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Error interno servidor' })
  }
}

export const identificar = async (req, res) => {
  try {
    const { telefono } = req.body
    if (!telefono) return res.status(400).json({ ok: false, message: 'Falta el teléfono' })

    const estudiantes = await buscarPorTelefono(telefono)
    return res.json({ ok: true, registrado: estudiantes.length > 0, estudiantes })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Error interno servidor' })
  }
}

export const getPagos = async (req, res) => {
  try {
    const { id } = req.params
    const { telefono } = req.query

    const permitido = await estudianteDelTelefono(id, telefono)
    if (!permitido) {
      return res.status(403).json({ ok: false, message: 'Este estudiante no pertenece a este número' })
    }

    const pagos = await obtenerPagos(id)
    return res.json({ ok: true, pagos })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ ok: false, error: 'Error interno servidor' })
  }
}
