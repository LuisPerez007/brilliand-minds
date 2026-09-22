import { useState, useEffect } from 'react'
import { getMostrarRecibos } from '../../../../services/controlPagosParaEstudiantes.js'

export const useRecibos = () => {
  const [recibos, setRecibos] = useState([])

  useEffect(() => {
    const cargarRecibos = async () => {
      try {
        const respuesta = await getMostrarRecibos()
        setRecibos(respuesta.data?.datos || [])
      } catch (error) {
        console.error('Error al cargar los recibos:', error)
      }
    }
    cargarRecibos()
  }, [])

  return { recibos }
}
