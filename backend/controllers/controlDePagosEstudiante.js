import { controlPagosDeEstudiantesACursos, marcarInscripcionComoPagada } from '../models/modelsInscripcion/controlPagosDeEstudianteACursos.js'

export const getControlDePagosEstudiante = async (req, res) => {
  try {
    const informe = await controlPagosDeEstudiantesACursos()
    return res.status(200).json({ datos: informe.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const putMarcarInscripcionComoPagada = async (req, res) => {
  try {
    const { idInscripcion } = req.params
    const informe = await marcarInscripcionComoPagada(idInscripcion)
    if (informe.rowCount === 0) {
      return res.status(404).json({ message: 'No se encontró la inscripción' })
    }
    return res.status(200).json({ message: 'Pago registrado correctamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}
