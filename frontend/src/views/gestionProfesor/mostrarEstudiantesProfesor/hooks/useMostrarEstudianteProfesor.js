import { useEffect, useState } from 'react'
import {
  getCursosProfesor,
  getEstudiantesProfesor,
} from '../../../../services/gestionProfesor/gestionprofesCursos'

export const useMostrarEstudianteProfesor = () => {
  const [estudianteProfesor, setEstudianteProfesor] = useState([])
  const cargarEstudianteProfesor = async () => {
    try {
      const datosEstudiantesProfesor = await getEstudiantesProfesor()
      console.log(`Mostrando estudiantes para profesor: ${datosEstudiantesProfesor.data.datos}`)
      setEstudianteProfesor(datosEstudiantesProfesor.data.datos)
    } catch (error) {
      console.error(error)
      console.error(error.response)
      alert('Error al mostrar Estudiantes para profesor')
    }
  }

  useEffect(() => {
    let componenteActivo = true

    getEstudiantesProfesor()
      .then((datosEstudiantesProfesor) => {
        if (componenteActivo) {
          console.log(`Mostrando estudiantes para profesor: ${datosEstudiantesProfesor.data.datos}`)
          setEstudianteProfesor(datosEstudiantesProfesor.data.datos)
        }
      })
      .catch((error) => {
        console.error(error)
        console.error(error.response)
        alert('Error al mostrar Estudiantes para profesor')
      })

    return () => {
      componenteActivo = false
    }
  }, [])

  return {
    cargarEstudianteProfesor,
    estudianteProfesor,
  }
}
