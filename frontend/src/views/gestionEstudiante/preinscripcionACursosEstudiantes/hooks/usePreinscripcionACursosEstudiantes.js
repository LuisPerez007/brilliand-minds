import { useCallback, useEffect, useState } from 'react'
import {
  crearInscripcionAunCursoEstudiante,
  getMostrarCursosNoInscritosDeunEstudiante,
  getMostrarDeudasEstudiante,
} from '../../../../services/gestionEstudiante/cursosEstudiante'

export const usePreinscripcionACursosEstudiantes = () => {
  const [cursosNoInscritos, setCursosNoInscritos] = useState([])
  const [tieneDeudasPendientes, setTieneDeudasPendientes] = useState(false)
  const [cargandoEstadoCuenta, setCargandoEstadoCuenta] = useState(true)
  const [deudasPendientes, setDeudasPendientes] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [inscripcionExitosa, setInscripcionExitosa] = useState(false)

  const mostrarFeedback = useCallback((message, color = 'danger') => {
    setFeedback({ message, color })
  }, [])

  const cargarCursosNoInscritosEstudiantes = useCallback(async () => {
    try {
      const informe = await getMostrarCursosNoInscritosDeunEstudiante()
      setCursosNoInscritos(informe?.data?.datos || [])
    } catch (error) {
      console.error(error)
      mostrarFeedback(error.response?.data?.message || 'Error del servidor interno')
    }
  }, [mostrarFeedback])

  const cargarEstadoCuenta = useCallback(async () => {
    try {
      const informe = await getMostrarDeudasEstudiante()
      const deudas = Array.isArray(informe.data) ? informe.data : informe.data?.datos || []
      const pendientes = deudas.filter(
        (deuda) => String(deuda.estado_pago).toUpperCase() === 'PENDIENTE',
      )
      setDeudasPendientes(pendientes)
      setTieneDeudasPendientes(pendientes.length > 0)
    } catch (error) {
      console.error(error)
      setDeudasPendientes([])
      setTieneDeudasPendientes(false)
      mostrarFeedback('No se pudo verificar el estado de tu cuenta. Inténtalo nuevamente.')
    } finally {
      setCargandoEstadoCuenta(false)
    }
  }, [mostrarFeedback])

  useEffect(() => {
    let componenteActivo = true

    Promise.allSettled([cargarCursosNoInscritosEstudiantes(), cargarEstadoCuenta()]).then(() => {
      if (!componenteActivo) return
    })

    return () => {
      componenteActivo = false
    }
  }, [cargarCursosNoInscritosEstudiantes, cargarEstadoCuenta])

  const crearInscripcionAunCursoParaEstudiante = async (idCurso) => {
    if (tieneDeudasPendientes || cargandoEstadoCuenta) return false

    try {
      const informe = await crearInscripcionAunCursoEstudiante(idCurso)
      mostrarFeedback(
        informe.data?.message || 'Tu solicitud de inscripción se procesó correctamente.',
        'success',
      )
      setInscripcionExitosa(true)
      await cargarEstadoCuenta()
      await cargarCursosNoInscritosEstudiantes()
      return true
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error interno del servidor'
      mostrarFeedback(mensaje)
      return false
    }
  }
  return {
    cursosNoInscritos,
    crearInscripcionAunCursoParaEstudiante,
    tieneDeudasPendientes,
    deudasPendientes,
    cargandoEstadoCuenta,
    feedback,
    limpiarFeedback: () => setFeedback(null),
    inscripcionExitosa,
    cerrarConfirmacion: () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur()
      }
      setInscripcionExitosa(false)
    },
  }
}
