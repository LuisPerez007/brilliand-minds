import { useCallback, useEffect, useState } from 'react'
import { obtenerCursosDisponibles } from '../../../../services/serviciosPublicos/cursosDisponibles'

export const useCursosDisponibles = () => {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cargarCursos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const respuesta = await obtenerCursosDisponibles()
      setCursos(respuesta.data || [])
      console.log('Cursos disponibles cargados:', respuesta.data)
    } catch (errorCarga) {
      console.error('Error al obtener cursos disponibles:', errorCarga)
      setError('No fue posible cargar los cursos disponibles. Inténtalo más tarde.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let componenteActivo = true

    cargarCursos().finally(() => {
      if (!componenteActivo) return
    })

    return () => {
      componenteActivo = false
    }
  }, [cargarCursos])

  return { cursos, loading, error, recargarCursos: cargarCursos }
}
