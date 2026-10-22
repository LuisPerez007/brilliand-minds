import { buscarPorTelefono } from '../../models/modelsChatbot/identificar.js'
import { calificacionesDelEstudiante } from '../../models/modelsChatbot/calificacionesModel.js'

export const obtenerCalificaciones = async (req, res) => {
  try {
    const idEstudiante = Number(req.params.id)
    const telefono = String(req.query.telefono || '').trim()

    if (!Number.isInteger(idEstudiante) || !telefono) {
      return res.status(400).json({ ok: false, mensaje: 'Datos inválidos' })
    }

    // Reutiliza la misma regla de /identificar
    const estudiantes = await buscarPorTelefono(telefono)
    const estudiante = estudiantes.find((e) => e.id_estudiante === idEstudiante)

    if (!estudiante) {
      return res.status(403).json({ ok: false, mensaje: 'Estudiante no asociado a este teléfono' })
    }

    const cursos = await calificacionesDelEstudiante(idEstudiante)
    return res.json({ ok: true, estudiante, cursos })
  } catch (error) {
    console.error('Error en obtenerCalificaciones:', error)
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' })
  }
}
