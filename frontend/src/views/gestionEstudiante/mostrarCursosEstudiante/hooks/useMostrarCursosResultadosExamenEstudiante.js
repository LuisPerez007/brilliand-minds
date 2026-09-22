import { useState, useEffect } from 'react'
import {
  getMostrarCalificaionesDeunCursoEstudiante,
  getMostrarCursosEstudiante,
} from '../../../../services/gestionEstudiante/cursosEstudiante'

export const useMostrarCursosResultadosExamenEstudiante = () => {
  const [cursosEstudiante, setCursosEstudiante] = useState([])
  const cargarCursosEstudiante = async () => {
    try {
      const informe = await getMostrarCursosEstudiante()
      setCursosEstudiante(informe.data?.datos || [])
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error al mostrar cursos estudiante'
      alert(mensaje)
    }
  }

  useEffect(() => {
    let componenteActivo = true

    getMostrarCursosEstudiante()
      .then((informe) => {
        if (componenteActivo) {
          setCursosEstudiante(informe.data?.datos || [])
        }
      })
      .catch((error) => {
        console.error(error)
        const mensaje = error.response?.data?.message || 'Error al mostrar cursos estudiante'
        alert(mensaje)
      })

    return () => {
      componenteActivo = false
    }
  }, [])

  const [mostrandoCalificaciones, setMostrandoCalificaciones] = useState(null)
  const [calificacionesDeunCurso, setCalificacionesDeunCurso] = useState([])
  const cargarCalificacionesDeunCursoEstudiante = async (idCurso) => {
    try {
      const informe = await getMostrarCalificaionesDeunCursoEstudiante(idCurso)
      if (informe.data?.datos.length === 0) {
        alert('No existe evaluciones')
        setCalificacionesDeunCurso([])
        return
      }
      setCalificacionesDeunCurso(informe.data?.datos || [])
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error interno del servidor'
      alert(mensaje)
    }
  }
  return {
    cursosEstudiante,
    cargarCalificacionesDeunCursoEstudiante,
    calificacionesDeunCurso,
    setCalificacionesDeunCurso,
    mostrandoCalificaciones,
    setMostrandoCalificaciones,
  }
}
