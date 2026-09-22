import { useCallback, useEffect, useState } from 'react'
import {
  deleteProfesor,
  getProfesor,
  postProfesor,
  putProfesor,
} from '../../../services/profesorService'
import { capitalizarTexto } from '../../utils/capitalizarTexto'

export const useProfesores = () => {
  const [feedback, setFeedback] = useState(null)
  const [accionEnProceso, setAccionEnProceso] = useState(null)
  const mostrarFeedback = (message, color = 'success') => {
    setFeedback({ message, color })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }
  const [profesorParaEliminar, setProfesorParaEliminar] = useState(null)
  const [cargando, setCargando] = useState(true)

  const [profesor, setProfesor] = useState([])

  const cargarProfesor = useCallback(async () => {
    try {
      const res = await getProfesor()
      console.log(res.data)
      setProfesor(res.data)
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al obtener datos', 'danger')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setCargando(true)
      await cargarProfesor()
      setCargando(false)
    }
    fetchData()
  }, [cargarProfesor])

  const valoresIniciales = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    ci: '',
    telefono: '',
    email: '',
    especialidad: '',
  }

  ///CREAR PROFESOR

  const [formulario, setFormulario] = useState(valoresIniciales)

  const crearProfesor = async (e) => {
    e.preventDefault()
    if (accionEnProceso) return
    if (!validarFormulario()) return
    setAccionEnProceso('guardar')
    try {
      const data = {
        nombre: formulario.nombre,
        apellidoPaterno: formulario.apellidoPaterno,
        apellidoMaterno: formulario.apellidoMaterno,
        ci: formulario.ci,
        telefono: formulario.telefono,
        email: formulario.email,
        especialidad: formulario.especialidad,
      }
      const respuesta = await postProfesor(data)
      setFormulario(valoresIniciales)
      mostrarFeedback(
        `${respuesta.data.message}\n\nUsuario: ${respuesta.data.Usuario}\nContraseña: ${respuesta.data.Contraceña}`,
        'success',
      )
      await cargarProfesor()
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
    const camposCapitalizados = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'especialidad']
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

  /// ACTUALIZAR PROFESOR
  const [editando, setEditando] = useState(false)
  const [idEditar, setIdEditar] = useState(null)

  const seleccionarProfesor = (profe) => {
    setFormulario({
      nombre: profe.nombre,
      apellidoPaterno: profe.a_paterno,
      apellidoMaterno: profe.a_materno,
      ci: profe.ci,
      telefono: profe.telefono,
      email: profe.email,
      especialidad: profe.especialidad,
    })
    setErrores({})
    setIdEditar(profe.id_profesor)
    setEditando(true)
  }

  const actualizarProfesor = async (e) => {
    e.preventDefault()
    if (accionEnProceso) return
    if (!validarFormulario()) return
    setAccionEnProceso('actualizar')
    try {
      const data = {
        nombre: formulario.nombre,
        apellidoPaterno: formulario.apellidoPaterno,
        apellidoMaterno: formulario.apellidoMaterno,
        ci: formulario.ci,
        telefono: formulario.telefono,
        email: formulario.email,
        especialidad: formulario.especialidad,
      }
      console.log('ID EDITAR:', idEditar)
      await putProfesor(idEditar, data)
      mostrarFeedback('Profesor actualizado correctamente', 'success')
      await cargarProfesor()
      return true
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al actualizar profesor', 'danger')
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  const descartar = () => {
    setEditando(false)
    setIdEditar(null)
    setFormulario({ ...valoresIniciales })
    mostrarFeedback('La edición fue cancelada', 'info')
  }

  const limpiarEdicion = () => {
    setErrores({})
    setEditando(false)
    setIdEditar(null)
    setFormulario({ ...valoresIniciales })
  }

  ///ELIMINAR PROFESOR
  const eliminarProfesor = (id) => {
    setProfesorParaEliminar(id)
  }

  const cancelarEliminacion = () => {
    setProfesorParaEliminar(null)
  }

  const confirmarEliminacion = async () => {
    if (!profesorParaEliminar) return
    if (accionEnProceso) return
    setAccionEnProceso('eliminar')

    try {
      await deleteProfesor(profesorParaEliminar)
      mostrarFeedback('Profesor eliminado correctamente', 'success')
      cargarProfesor()
      cancelarEliminacion()
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al eliminar profesor', 'danger')
    } finally {
      setAccionEnProceso(null)
    }
  }

  /// SEGURIDAD
  const [errores, setErrores] = useState({})
  const validarFormulario = () => {
    const nuevosErrores = {}
    if (!formulario.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    }
    if (!formulario.apellidoPaterno?.trim()) {
      nuevosErrores.apellidoPaterno = 'Apellido paterno es obligatorio'
    }
    if (formulario.apellidoMaterno && !formulario.apellidoMaterno.trim()) {
      nuevosErrores.apellidoMaterno = 'Apellido materno inválido'
    }
    if (!formulario.ci?.trim()) {
      nuevosErrores.ci = 'CI es obligatorio'
    }
    if (!formulario.telefono?.trim()) {
      nuevosErrores.telefono = 'Telefono es obligatorio'
    }
    if (formulario.email && !/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'Email inválido'
    }

    if (!formulario.especialidad?.trim()) {
      nuevosErrores.especialidad = 'Especialidad es obligatoria'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }
  return {
    handleChange,
    descartar,
    editando,
    actualizarProfesor,
    crearProfesor,
    formulario,
    errores,
    profesor,
    seleccionarProfesor,
    eliminarProfesor,
    profesorParaEliminar,
    cancelarEliminacion,
    confirmarEliminacion,
    feedback,
    accionEnProceso,
    cargando,
    limpiarEdicion,
  }
}
