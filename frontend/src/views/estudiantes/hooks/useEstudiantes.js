import { useEffect, useState } from 'react'
import {
  deleteEstudiantes,
  getEstudiantes,
  postEstudiantes,
  putEstudiantes,
} from '../../../services/estudiantesService'

import { getCursos } from '../../../services/cursosService'
import {
  postInscripciones,
  mostrarInscripcionPorEstudiante,
} from '../../../services/inscripcionesService'
import { getMostrandoPadresTutores } from '../../../services/padreTutorService'
import { capitalizarTexto } from '../../utils/capitalizarTexto'

export const useEstudiantes = () => {
  const [feedback, setFeedback] = useState(null)
  const [accionEnProceso, setAccionEnProceso] = useState(null)
  const mostrarFeedback = (message, color = 'success') => {
    setFeedback({ message, color })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }
  const [estudianteParaEliminar, setEstudianteParaEliminar] = useState(null)

  const valoresIniciales = {
    nombre: '',
    a_paterno: '',
    a_materno: '',
    ci: '',
    direccion: '',
    colegio: '',
    telefono: '',
    email: '',
    idTutor: null,
  }

  //cargar cursos
  const [cursos, setCursos] = useState([])
  const cargarCursos = async () => {
    try {
      const response = await getCursos()
      console.log(response.data)
      setCursos(response.data)
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al cargar cursos', 'danger')
    }
  }

  const [cursosSeleccionados, setcursosSeleccionados] = useState([])

  const handleCursos = (e) => {
    const opciones = Array.from(e.target.selectedOptions)
    const elementos = opciones.map((op) => Number(op.value))
    setcursosSeleccionados(elementos)
  }

  //mostrar inscripcion por estudiante
  const [seleccionados, setSeleccionados] = useState([])
  const mostrarCursosPorEstudiante = async (id) => {
    try {
      const informe = await mostrarInscripcionPorEstudiante(id)
      mostrarFeedback(informe.data.message, 'info')
      setSeleccionados(informe.data.idsCursos)
      console.log(`resultado de mostrar por estudiante: `)
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al mostrar la inscripción del estudiante', 'danger')
    }
  }

  //TODO SOBRE UNA VENTANITA
  const [modalInscripcion, setModalInscripcion] = useState(false)
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null)

  const abrirModalInscripcion = async (estudiante) => {
    try {
      const informe = await mostrarInscripcionPorEstudiante(estudiante.id_estudiante)
      const idsCursos = informe.data.idsCursos || []
      console.log('Cursos recibidos:', idsCursos)

      setcursosSeleccionados([...idsCursos])
      setEstudianteSeleccionado(estudiante)
      setModalInscripcion(true)

      console.log(`resultado de mostrar por estudiante: `)
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al mostrar la inscripción del estudiante', 'danger')
    }
  }

  const cerrarModalInscripcion = () => {
    setEstudianteSeleccionado(null)
    setModalInscripcion(false)
  }

  /// ccargarEstudaintes

  const [estudiantes, setEstudiantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [padresTutores, setPadresTutores] = useState([])
  const [ciPadreTutorBusqueda, setCiPadreTutorBusqueda] = useState('')
  const [padreTutorSeleccionado, setPadreTutorSeleccionado] = useState(null)

  const cargarEstudiantes = async () => {
    try {
      const res = await getEstudiantes()
      setEstudiantes(res.data)
    } catch (error) {
      console.error(`error al obtener estudiantes`, error)
      mostrarFeedback('Error al obtener estudiantes', 'danger')
    }
  }

  useEffect(() => {
    let componenteActivo = true
    setCargando(true)

    Promise.allSettled([getEstudiantes(), getCursos(), getMostrandoPadresTutores()]).then(
      (resultados) => {
        if (!componenteActivo) return
        if (resultados[0].status === 'fulfilled') {
          setEstudiantes(resultados[0].value.data)
        } else {
          console.error(`error al obtener estudiantes`, resultados[0].reason)
          mostrarFeedback('Error al obtener estudiantes', 'danger')
        }
        if (resultados[1].status === 'fulfilled') {
          setCursos(resultados[1].value.data)
        }
        if (resultados[2].status === 'fulfilled') {
          setPadresTutores(resultados[2].value.data)
        } else {
          console.error('error al obtener padres y tutores', resultados[2].reason)
          mostrarFeedback('Error al obtener padres y tutores', 'danger')
        }
        setCargando(false)
      },
    )

    return () => {
      componenteActivo = false
    }
  }, [])

  const buscarPadreTutor = () => {
    const ciBuscado = ciPadreTutorBusqueda.trim()
    const padreTutor = padresTutores.find((padre) => String(padre.ci) === ciBuscado)

    setPadreTutorSeleccionado(padreTutor || null)
    setFormulario((formularioActual) => ({
      ...formularioActual,
      idTutor: padreTutor?.id_tutor || null,
    }))
    setErrores((erroresActuales) => ({
      ...erroresActuales,
      idTutor: padreTutor ? '' : 'No se encontró un padre o tutor con ese CI',
    }))
  }

  const asignarPadreTutor = (padreTutor) => {
    setPadreTutorSeleccionado(padreTutor)
    setCiPadreTutorBusqueda(String(padreTutor.ci || ''))
    setFormulario((formularioActual) => ({
      ...formularioActual,
      idTutor: padreTutor.id_tutor,
    }))
    setErrores((erroresActuales) => ({ ...erroresActuales, idTutor: '' }))
  }

  /// post INSCRIPCIONES
  const crearInscripcion = async (e) => {
    if (accionEnProceso) return
    try {
      if (!estudianteSeleccionado) {
        mostrarFeedback('Seleccione un estudiante', 'warning')
        return
      }

      const id_estudiante = estudianteSeleccionado.id_estudiante || ''
      const seleccionados = cursosSeleccionados

      setAccionEnProceso('inscribir')
      const data = await postInscripciones({ idEstudiante: id_estudiante, idCurso: seleccionados })
      const respuestaBackend = data.data ? data.data : data
      const insertados = Number(respuestaBackend.insertados || 0)
      const eliminados = Number(respuestaBackend.eliminados || 0)
      const huboCambios = insertados > 0 || eliminados > 0

      mostrarFeedback(
        `${respuestaBackend.message}.
      - Insertados: ${insertados}
      - Eliminados: ${eliminados}
      - Total de cursos actuales: ${respuestaBackend.totalCursos}`,
        huboCambios ? 'success' : 'warning',
      )
      return { ...respuestaBackend, huboCambios }
    } catch (error) {
      console.error(error)
      const mensaje = error.response?.data?.message || 'Error al inscribir estudiante'
      mostrarFeedback(mensaje, 'danger')
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  // postEstudiantes
  const [formulario, setFormulario] = useState({ ...valoresIniciales })

  const crearEstudiante = async (e) => {
    e.preventDefault()
    if (accionEnProceso) return
    if (!validarFormulario()) return
    setAccionEnProceso('guardar')
    try {
      const data = {
        nombre: formulario.nombre,
        apellidoPaterno: formulario.a_paterno,
        apellidoMaterno: formulario.a_materno,
        ci: formulario.ci,
        direccion: formulario.direccion,
        colegio: formulario.colegio,
        telefono: formulario.telefono,
        email: formulario.email,
        idTutor: formulario.idTutor,
      }

      const respuesta = await postEstudiantes(data)
      mostrarFeedback(
        `${respuesta.data.message}\n\nUsuario: ${respuesta.data.Usuario}\nContraseña: ${respuesta.data.Contraceña}`,
        'success',
      )
      await cargarEstudiantes()
      setFormulario({ ...valoresIniciales })
      setErrores({})
      setPadreTutorSeleccionado(null)
      setCiPadreTutorBusqueda('')
      return true
    } catch (error) {
      console.error(error)
      if (error.response?.data?.message) {
        mostrarFeedback(`Atención: ${error.response.data.message}`, 'danger')
      } else {
        mostrarFeedback(
          'Hubo un problema de conexión con el servidor. Inténtalo más tarde.',
          'danger',
        )
      }
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  const handleChange = (e) => {
    const camposCapitalizados = ['nombre', 'a_paterno', 'a_materno', 'direccion', 'colegio']
    const valor = camposCapitalizados.includes(e.target.name)
      ? capitalizarTexto(e.target.value)
      : e.target.value

    setFormulario({
      ...formulario,
      [e.target.name]: valor,
    })

    setErrores({
      ...errores,
      [e.target.name]: '',
    })
  }

  /// Actualizar estudiante
  const [editando, setEditando] = useState(false)
  const [idEditar, setIdEditar] = useState(null)

  const seleccionarEstudiante = (est) => {
    setFormulario({
      nombre: est.nombre,
      a_paterno: est.a_paterno,
      a_materno: est.a_materno,
      ci: est.ci,
      direccion: est.direccion,
      colegio: est.colegio,
      telefono: est.telefono,
      email: est.email,
      idTutor: est.idTutor || est.id_tutor || null,
    })
    const idTutor = est.idTutor || est.id_tutor
    const padreTutor = padresTutores.find((padre) => padre.id_tutor === idTutor)
    setPadreTutorSeleccionado(padreTutor || null)
    setCiPadreTutorBusqueda(String(padreTutor?.ci || ''))
    setErrores({})
    setEditando(true)
    setIdEditar(est.id_estudiante)
  }

  const actualizarEstudiante = async (e) => {
    e.preventDefault()
    if (accionEnProceso) return
    if (!validarFormulario()) return
    setAccionEnProceso('actualizar')
    try {
      const data = {
        nombre: formulario.nombre,
        apellidoPaterno: formulario.a_paterno,
        apellidoMaterno: formulario.a_materno,
        ci: formulario.ci,
        direccion: formulario.direccion,
        colegio: formulario.colegio,
        telefono: formulario.telefono,
        email: formulario.email,
        idTutor: formulario.idTutor,
      }
      await putEstudiantes(idEditar, data)
      mostrarFeedback('Estudiante actualizado correctamente', 'success')
      await cargarEstudiantes()
      setFormulario({ ...valoresIniciales })

      setErrores({})
      setEditando(false)
      setIdEditar(null)
      return true
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al actualizar estudiante', 'danger')
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  ///ELIMINAR STUDIANTE
  const eliminarEstudiante = (id) => {
    setEstudianteParaEliminar(id)
  }

  const cancelarEliminacion = () => {
    setEstudianteParaEliminar(null)
  }

  const confirmarEliminacion = async () => {
    if (!estudianteParaEliminar) return
    if (accionEnProceso) return
    setAccionEnProceso('eliminar')
    cancelarEliminacion()

    try {
      await deleteEstudiantes(estudianteParaEliminar)
      mostrarFeedback('Estudiante eliminado correctamente', 'success')
      await cargarEstudiantes()
    } catch (error) {
      console.error(error)
      const mensaje =
        error.response?.data?.message ||
        'No se pudo eliminar el estudiante. Verifique la conexión e inténtelo nuevamente.'
      mostrarFeedback(mensaje, 'danger')
    } finally {
      setAccionEnProceso(null)
    }
  }

  ///SEGURIDAD
  const [errores, setErrores] = useState({})
  const validarFormulario = () => {
    const nuevosErrores = {}
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    }
    if (!formulario.a_paterno.trim()) {
      nuevosErrores.a_paterno = 'Apellido paterno obligatorio'
    }
    if (!formulario.ci.trim()) {
      nuevosErrores.ci = 'CI obligatorio'
    }
    if (!formulario.direccion.trim()) {
      nuevosErrores.direccion = 'Dirección obligatorio'
    }
    if (!formulario.telefono.trim()) {
      nuevosErrores.telefono = 'Teléfono obligatorio'
    }
    if (!formulario.idTutor) {
      nuevosErrores.idTutor = 'Debe asociar un padre o tutor'
    }
    if (formulario.email && !/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'Email inválido'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  ///Descartar

  const descartar = () => {
    setEditando(false)
    setIdEditar(null)
    setFormulario({ ...valoresIniciales })
    setPadreTutorSeleccionado(null)
    setCiPadreTutorBusqueda('')
    mostrarFeedback('La edición fue cancelada', 'info')
  }
  return {
    seleccionados,
    mostrarCursosPorEstudiante,
    crearInscripcion,
    handleCursos,
    cursos,
    cursosSeleccionados,
    estudianteSeleccionado,
    modalInscripcion,
    abrirModalInscripcion,
    cerrarModalInscripcion,
    cargarEstudiantes,
    estudiantes,
    formulario,
    errores,
    editando,
    handleChange,
    crearEstudiante,
    actualizarEstudiante,
    seleccionarEstudiante,
    eliminarEstudiante,
    estudianteParaEliminar,
    cancelarEliminacion,
    confirmarEliminacion,
    descartar,
    feedback,
    accionEnProceso,
    cargando,
    limpiarFeedback: () => setFeedback(null),
    padresTutores,
    ciPadreTutorBusqueda,
    setCiPadreTutorBusqueda,
    padreTutorSeleccionado,
    buscarPadreTutor,
    asignarPadreTutor,
  }
}
