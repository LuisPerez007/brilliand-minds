import { useEffect, useState } from 'react'
import {
  deleteEvaluacionDeunCursoProfesor,
  getCursosEvaluacionProfesor,
  getEvaluacionCursoProfesor,
  listarCalificacionesEvaluacion,
  postCalificarExamenEstudiante,
  postCrearEvaluacionAunCursoProfesor,
  putCalificarExamenEstudiante,
  putEditarEvaluacionAunCursoProfesor,
} from '../../../../services/gestionProfesor/gestionprofesCursos'

export const useCursosEvaluacionProfesor = () => {
  const [cursoEvaluacionProfesor, setCursoEvaluacionProfesor] = useState([])
  const cargarCursosEvaluacionProfesor = async () => {
    try {
      const datosCursoEvaluacionProfesor = await getCursosEvaluacionProfesor()
      console.log(
        `Mostrando cursos para evaluacion para profesor: ${datosCursoEvaluacionProfesor.data.datos}`,
      )
      setCursoEvaluacionProfesor(datosCursoEvaluacionProfesor.data.datos)
    } catch (error) {
      console.error(error)
      console.error(error.response)
      const mensaje = error.response?.data?.message || 'Error al mostrar Estudiantes para profesor'
      alert(mensaje)
    }
  }

  useEffect(() => {
    let componenteActivo = true

    getCursosEvaluacionProfesor()
      .then((datosCursoEvaluacionProfesor) => {
        if (componenteActivo) {
          console.log(
            `Mostrando cursos para evaluacion para profesor: ${datosCursoEvaluacionProfesor.data.datos}`,
          )
          setCursoEvaluacionProfesor(datosCursoEvaluacionProfesor.data.datos)
        }
      })
      .catch((error) => {
        console.error(error)
        console.error(error.response)
        const mensaje =
          error.response?.data?.message || 'Error al mostrar Estudiantes para profesor'
        alert(mensaje)
      })

    return () => {
      componenteActivo = false
    }
  }, [])

  const [evaluacionesCurso, setEvaluacionesCurso] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)
  const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null)
  const mostrarEvaluacionesDeunCurso = async (idCurso) => {
    try {
      console.log(`PASANDO EL ID: ${idCurso}`)
      const datosEvaluacionPorCurso = await getEvaluacionCursoProfesor(idCurso)
      console.log(
        `Mostrando evaluaciones por curso para profesor: ${datosEvaluacionPorCurso.data.datos}`,
      )
      setEvaluacionesCurso(datosEvaluacionPorCurso.data.datos ?? [])
      setCursoSeleccionado(idCurso)
      setEvaluacionSeleccionada(null)
    } catch (error) {
      console.error(error)
      console.error(error.response)
      const mensaje =
        error.response?.data?.message || 'Error al mostrar evaluaciones por curso de profesor'
      alert(mensaje)
    }
  }
  //////
  const datosIniciales = {
    nombreEvaluacion: '',
    descripcion: '',
    fechaEvaluacion: '',
    porcentaje: '',
  }
  const [datosExamen, setDatosExamen] = useState({ ...datosIniciales })
  const [cursoCrearExamenSelecionado, setCursoCrearExamenSeleccionado] = useState(null)
  const crearEvaluacionDeunCurso = async (
    idCurso,
    nombreEvaluacion,
    descripcion,
    fechaEvaluacion,
    porcentaje,
  ) => {
    try {
      if (!validarEvaluacion(nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje)) {
        return
      }
      const datos = { idCurso, nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje }
      await postCrearEvaluacionAunCursoProfesor(datos)
      alert('Evaluacion creada Correctamente')
      await mostrarEvaluacionesDeunCurso(idCurso)
      setCursoCrearExamenSeleccionado(null)
      setDatosExamen({ ...datosIniciales })
    } catch (error) {
      console.error(error)
      const mensaje =
        error.response?.data?.errores?.[0]?.msg ||
        error.response?.data?.message ||
        'Error interno del servidor'
      alert(mensaje)
    }
  }

  const [editarExamenCursoSeleccionada, setEditarExamenCursoSeleccionada] = useState(null)
  const editarEvaluacionDeunCurso = async (
    idEvaluacion,
    idCurso,
    nombreEvaluacion,
    descripcion,
    fechaEvaluacion,
    porcentaje,
  ) => {
    try {
      if (!validarEvaluacion(nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje)) {
        return
      }
      const datos = {
        idEvaluacion,
        idCurso,
        nombreEvaluacion,
        descripcion,
        fechaEvaluacion,
        porcentaje,
      }
      await putEditarEvaluacionAunCursoProfesor(datos)
      alert('Evaluacion actualizada Correctamente')
      await mostrarEvaluacionesDeunCurso(idCurso)
    } catch (error) {
      console.error(error)
      const mensaje =
        error.response?.data?.errores?.[0]?.msg ||
        error.response?.data?.message ||
        'Error interno del servidor'
      alert(mensaje)
    }
  }

  const eliminarEvaluacionDeunCurso = async (idCurso, idEvaluacion) => {
    try {
      const informe = await deleteEvaluacionDeunCursoProfesor(idEvaluacion)
      await mostrarEvaluacionesDeunCurso(idCurso)
      alert(informe.data?.message)
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error al eliminar evaluacion'
      alert(mensaje)
    }
  }

  const [listaCalificacion, setListaCalificacion] = useState([])
  const [cargandoCalificaciones, setCargandoCalificaciones] = useState(false)
  const cargarListaCalificaciones = async (idCurso, idEvaluacion) => {
    setCargandoCalificaciones(true)
    try {
      const datosListaEvaluacion = await listarCalificacionesEvaluacion(idCurso, idEvaluacion)
      setListaCalificacion(datosListaEvaluacion.data.datos)
      setEvaluacionSeleccionada(idEvaluacion)
    } catch (error) {
      console.error(error)
      const mensaje =
        error.response?.data?.message || 'Error al mostrar la lista de examen de los estudiantes'
      alert(mensaje)
    } finally {
      setCargandoCalificaciones(false)
    }
  }

  const registrarCalificacion = async (
    idCurso,
    idEvaluacion,
    idInscripcion,
    nota,
    observacion,
    idEstudiante,
  ) => {
    try {
      if (!validarCalificacion(nota, observacion)) {
        return
      }
      const datos = {
        idEvaluacion: idEvaluacion,
        idInscripcion: idInscripcion,
        nota: nota,
        observacion: observacion,
        idEstudiante: idEstudiante,
      }
      await postCalificarExamenEstudiante(datos)
      await cargarListaCalificaciones(idCurso, idEvaluacion)
    } catch (error) {
      console.error(error)
      const mensaje =
        error.response?.data?.errores?.[0]?.msg ||
        error.response?.data?.message ||
        'Error interno al registrar calificación'
      alert(mensaje)
    }
  }

  const [calificacionEditando, setCalificacionEditando] = useState(null)
  const editarCalificacion = async (
    idCurso,
    idEvaluacion,
    idInscripcion,
    idCalificacion,
    nota,
    observacion,
    idEstudiante,
  ) => {
    try {
      if (!validarCalificacion(nota, observacion)) {
        return
      }
      const datos = { idEvaluacion, idInscripcion, idCalificacion, nota, observacion, idEstudiante }
      await putCalificarExamenEstudiante(datos)
      await cargarListaCalificaciones(idCurso, idEvaluacion)
    } catch (error) {
      console.error(error)
      const mensaje =
        error.response?.data?.errores?.[0]?.msg ||
        error.response?.data?.message ||
        'Error interno al actualizar calificación'
      alert(mensaje)
    }
  }

  const validarCalificacion = (nota, observacion) => {
    if (nota === null || nota === undefined || nota === '') {
      alert('Debe ingresar una nota')
      return false
    }
    if (nota < 0 || nota > 100) {
      alert('La nota debe estar entre 0 y 100')
      return false
    }
    if (observacion && observacion.length > 500) {
      alert('La observación no puede superar los 500 caracteres')
      return false
    }

    return true
  }

  const validarEvaluacion = (nombreEvaluacion, descripcion, fechaEvaluacion, porcentaje) => {
    if (!nombreEvaluacion?.trim()) {
      alert('El nombre del examen es obligatorio')
      return false
    }
    if (!descripcion?.trim()) {
      alert('La descripción es obligatoria')
      return false
    }
    if (!fechaEvaluacion) {
      alert('La fecha del examen es obligatoria')
      return false
    }
    if (porcentaje === null || porcentaje === undefined || porcentaje === '') {
      alert('El porcentaje es obligatorio')
      return false
    }
    return true
  }
  return {
    cursoCrearExamenSelecionado,
    setCursoCrearExamenSeleccionado,
    crearEvaluacionDeunCurso,
    evaluacionSeleccionada,
    listaCalificacion,
    cargandoCalificaciones,
    setListaCalificacion,
    cargarListaCalificaciones,
    cargarCursosEvaluacionProfesor,
    cursoEvaluacionProfesor,
    evaluacionesCurso,
    mostrarEvaluacionesDeunCurso,
    cursoSeleccionado,
    setCursoSeleccionado,
    setEvaluacionSeleccionada,
    registrarCalificacion,
    editarCalificacion,
    calificacionEditando,
    setCalificacionEditando,
    datosExamen,
    setDatosExamen,
    editarExamenCursoSeleccionada,
    setEditarExamenCursoSeleccionada,
    editarEvaluacionDeunCurso,
    eliminarEvaluacionDeunCurso,
  }
}
