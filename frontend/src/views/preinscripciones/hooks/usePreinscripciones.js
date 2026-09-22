import { useEffect, useState, useCallback } from 'react'
import {
  getPreinscripcionEstudiante,
  postPreinscripcionAceptada,
  postPreinscripcionRechazado,
} from '../../../services/preInscripcionEstudianteRoutes'
import { postEstudiantes } from '../../../services/estudiantesService'

export const usePreinscripciones = () => {
  const [feedback, setFeedback] = useState(null)
  const [solicitudEnProceso, setSolicitudEnProceso] = useState(null)
  const mostrarFeedback = (message, color = 'success') => {
    setFeedback({ message, color })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }
  const [cargando, setCargando] = useState(true)
  const [preinscripciones, setPreinscripciones] = useState([])
  const cargarPreinscripciones = useCallback(async () => {
    try {
      const datos = await getPreinscripcionEstudiante()
      console.log(datos.data)
      setPreinscripciones(datos.data)
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al obtener datos', 'danger')
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      setCargando(true)
      await cargarPreinscripciones()
      setCargando(false)
    }
    load()
  }, [cargarPreinscripciones])

  const aceptarSolicitud = async (idSolicitud, idTutor) => {
    if (solicitudEnProceso) return
    setSolicitudEnProceso({ id: idSolicitud, tipo: 'aprobar' })
    try {
      const datosSolicitudEstudiante = preinscripciones.find((item) => item.id === idSolicitud)
      if (!datosSolicitudEstudiante || !idTutor) {
        mostrarFeedback('Debe seleccionar un padre o tutor', 'warning')
        return false
      }

      const nombreSeparado = datosSolicitudEstudiante.nombre.trim().split(/\s+/)
      if (nombreSeparado.length > 3 && nombreSeparado.length < 5) {
        nombreSeparado[0] = nombreSeparado[0] + ' ' + nombreSeparado[1]
        nombreSeparado.splice(1, 1)
      }
      const data = {
        nombre: nombreSeparado[0],
        apellidoPaterno: nombreSeparado[1],
        apellidoMaterno: nombreSeparado[2],
        ci: datosSolicitudEstudiante.ci,
        direccion: datosSolicitudEstudiante.direccion,
        colegio: datosSolicitudEstudiante.colegio,
        telefono: datosSolicitudEstudiante.telefono,
        email: datosSolicitudEstudiante.email,
        idTutor,
      }
      await postEstudiantes(data)
      await postPreinscripcionAceptada(idSolicitud)
      await cargarPreinscripciones()
      return true
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error interno'
      mostrarFeedback(mensaje, 'danger')
      return false
    } finally {
      setSolicitudEnProceso(null)
    }
  }

  // Rechazado
  const rechazarSolicitud = async (idSolicitud) => {
    if (solicitudEnProceso) return
    setSolicitudEnProceso({ id: idSolicitud, tipo: 'rechazar' })
    try {
      await postPreinscripcionRechazado(idSolicitud)
      await cargarPreinscripciones()
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error interno'
      mostrarFeedback(mensaje, 'danger')
    } finally {
      setSolicitudEnProceso(null)
    }
  }

  return {
    aceptarSolicitud,
    rechazarSolicitud,
    cargarPreinscripciones,
    preinscripciones,
    feedback,
    solicitudEnProceso,
    cargando,
    limpiarFeedback: () => setFeedback(null),
  }
}
