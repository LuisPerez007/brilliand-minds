import { useCallback, useEffect, useState } from 'react'
import {
  deleteEliminarPadreTutor,
  getMostrandoPadresTutores,
  postRegistroPadreTutor,
  putActualizarPadreTutor,
} from '../../../services/padreTutorService'
import { capitalizarTexto } from '../../utils/capitalizarTexto'

export const usePadreTutor = () => {
  const [padresTutores, setPadresTutores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [feedback, setFeedback] = useState(null)
  const [accionEnProceso, setAccionEnProceso] = useState(null)
  const [padreTutorParaEliminar, setPadreTutorParaEliminar] = useState(null)
  const [editando, setEditando] = useState(false)
  const [idEditar, setIdEditar] = useState(null)
  const valoresIniciales = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    ci: '',
    telefono: '',
    direccion: '',
  }
  const [formulario, setFormulario] = useState({ ...valoresIniciales })
  const [errores, setErrores] = useState({})
  const [padreTutorCreado, setPadreTutorCreado] = useState(null)

  const mostrarFeedback = (message, color = 'success') => {
    setFeedback({ message, color })
    setTimeout(() => setFeedback(null), 4000)
  }

  const cargarPadresTutores = useCallback(async () => {
    try {
      const informe = await getMostrandoPadresTutores()
      setPadresTutores(informe.data)
      return informe.data
    } catch (error) {
      console.error(error)
      mostrarFeedback(
        error.response?.data?.message || 'Error al cargar los padres y tutores',
        'danger',
      )
    }
  }, [])

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      await cargarPadresTutores()
      setCargando(false)
    }
    cargar()
  }, [cargarPadresTutores])

  const validarFormulario = () => {
    const nuevosErrores = {}
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio'
    if (!formulario.apellidoPaterno.trim()) {
      nuevosErrores.apellidoPaterno = 'Apellido paterno es obligatorio'
    }
    if (!formulario.ci.trim()) nuevosErrores.ci = 'El CI es obligatorio'
    if (!formulario.telefono.trim()) nuevosErrores.telefono = 'El teléfono es obligatorio'
    if (!formulario.direccion.trim()) nuevosErrores.direccion = 'La dirección es obligatoria'
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChange = (event) => {
    const camposCapitalizados = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'direccion']
    const valor = camposCapitalizados.includes(event.target.name)
      ? capitalizarTexto(event.target.value)
      : event.target.value

    setFormulario({ ...formulario, [event.target.name]: valor })
    setErrores({ ...errores, [event.target.name]: '' })
  }

  const crearPadreTutor = async (event) => {
    event.preventDefault()
    if (accionEnProceso || !validarFormulario()) return false
    setAccionEnProceso('guardar')
    try {
      const data = {
        nombre: formulario.nombre,
        apellidoPaterno: formulario.apellidoPaterno,
        apellidoMaterno: formulario.apellidoMaterno,
        ci: formulario.ci,
        telefono: formulario.telefono,
        direccion: formulario.direccion,
      }
      await postRegistroPadreTutor(data)
      const padresActualizados = await cargarPadresTutores()
      const padreCreado = padresActualizados?.find(
        (padreTutor) => String(padreTutor.ci) === data.ci,
      )
      setPadreTutorCreado(padreCreado || null)
      setFormulario({ ...valoresIniciales })
      setErrores({})
      mostrarFeedback('Padre/Tutor registrado exitosamente.')
      return true
    } catch (error) {
      mostrarFeedback(
        error.response?.data?.message || 'Error al registrar el padre/tutor',
        'danger',
      )
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  const seleccionarPadreTutor = (padreTutor) => {
    setFormulario({
      nombre: padreTutor.nombre || '',
      apellidoPaterno: padreTutor.apellidoPaterno || padreTutor.a_paterno || '',
      apellidoMaterno: padreTutor.apellidoMaterno || padreTutor.a_materno || '',
      ci: padreTutor.ci || '',
      telefono: padreTutor.telefono || '',
      direccion: padreTutor.direccion || '',
    })
    setErrores({})
    setIdEditar(padreTutor.id_tutor)
    setEditando(true)
  }

  const actualizarPadreTutor = async (event) => {
    event.preventDefault()
    if (accionEnProceso || !validarFormulario()) return false
    setAccionEnProceso('actualizar')
    try {
      const data = {
        nombre: formulario.nombre,
        apellidoPaterno: formulario.apellidoPaterno,
        apellidoMaterno: formulario.apellidoMaterno,
        ci: formulario.ci,
        telefono: formulario.telefono,
        direccion: formulario.direccion,
      }
      await putActualizarPadreTutor(idEditar, data)
      await cargarPadresTutores()
      setFormulario({ ...valoresIniciales })
      setErrores({})
      setEditando(false)
      setIdEditar(null)
      mostrarFeedback('Padre/Tutor actualizado exitosamente.')
      return true
    } catch (error) {
      mostrarFeedback(
        error.response?.data?.message || 'Error al actualizar el padre/tutor',
        'danger',
      )
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  const descartar = () => {
    setFormulario({ ...valoresIniciales })
    setErrores({})
    setEditando(false)
    setIdEditar(null)
    setPadreTutorCreado(null)
  }

  const eliminarPadreTutor = (id) => setPadreTutorParaEliminar(id)
  const cancelarEliminacion = () => setPadreTutorParaEliminar(null)

  const confirmarEliminacion = async () => {
    if (!padreTutorParaEliminar || accionEnProceso) return
    setAccionEnProceso('eliminar')
    try {
      await deleteEliminarPadreTutor(padreTutorParaEliminar)
      await cargarPadresTutores()
      cancelarEliminacion()
      mostrarFeedback('Padre/Tutor eliminado exitosamente.')
    } catch (error) {
      mostrarFeedback(error.response?.data?.message || 'Error al eliminar el padre/tutor', 'danger')
    } finally {
      setAccionEnProceso(null)
    }
  }

  return {
    padresTutores,
    cargando,
    feedback,
    limpiarFeedback: () => setFeedback(null),
    accionEnProceso,
    formulario,
    errores,
    editando,
    handleChange,
    crearPadreTutor,
    actualizarPadreTutor,
    seleccionarPadreTutor,
    descartar,
    eliminarPadreTutor,
    padreTutorParaEliminar,
    cancelarEliminacion,
    confirmarEliminacion,
    padreTutorCreado,
    cargarPadresTutores,
  }
}
