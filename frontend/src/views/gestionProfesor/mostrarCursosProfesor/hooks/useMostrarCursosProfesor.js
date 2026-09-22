import { useEffect, useState } from 'react'
import { getCursosProfesor } from '../../../../services/gestionProfesor/gestionprofesCursos'

export const useMostrarCursosProfesor = () => {
  const [cursosProfesor, setCursosprofesor] = useState([])
  const cargarCursosProfesor = async () => {
    try {
      const datosCursosProfesor = await getCursosProfesor()
      console.log(`Mostrando cursos para profesor: ${datosCursosProfesor.data.datos}`)
      setCursosprofesor(datosCursosProfesor.data.datos)
    } catch (error) {
      console.error(error)
      console.error(error.response)
      alert('Error al mostrarCursos')
    }
  }

  useEffect(() => {
    let componenteActivo = true

    getCursosProfesor()
      .then((datosCursosProfesor) => {
        if (componenteActivo) {
          console.log(`Mostrando cursos para profesor: ${datosCursosProfesor.data.datos}`)
          setCursosprofesor(datosCursosProfesor.data.datos)
        }
      })
      .catch((error) => {
        console.error(error)
        console.error(error.response)
        alert('Error al mostrarCursos')
      })

    return () => {
      componenteActivo = false
    }
  }, [])

  return {
    cargarCursosProfesor,
    cursosProfesor,
  }
}
