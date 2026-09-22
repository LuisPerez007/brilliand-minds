import { mostrarRecibos, registrarRecibos, controlPagosDeEstudiantesACursos, marcarInscripcionComoPagada, verificarRecibo } from '../models/modelsInscripcion/controlPagosDeEstudianteACursos.js'
import { crearTokenRecibo, obtenerIdDesdeTokenRecibo } from '../utils/tokenVerificacionRecibo.js'

export const getMostrarRecibos = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const informe = await mostrarRecibos()
    return res.status(200).json({ datos: informe.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const postRegistrarRecibos = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const informe = await registrarRecibos(req.body)
    if (informe.rowCount === 0) {
      return res.status(400).json({ message: 'No se pudo registrar el recibo' })
    }
    const recibo = informe.rows[0]
    return res.status(201).json({
      message: 'Recibo registrado correctamente',
      datos: { ...recibo, token_verificacion: crearTokenRecibo(recibo.id_recibo) }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

export const getVerificarRecibo = async (req, res) => {
  try {
    const idRecibo = obtenerIdDesdeTokenRecibo(req.params.token)

    if (!idRecibo) {
      return res.status(400).json({ message: 'Código de recibo inválido' })
    }

    const informe = await verificarRecibo(idRecibo)

    if (informe.rowCount === 0) {
      return res.status(404).json({ message: 'Recibo no encontrado' })
    }

    return res.status(200).json({
      valido: true,
      recibo: informe.rows[0]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno servidor' })
  }
}

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
