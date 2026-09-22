import { getCursos, postCursos, putCursos, deleteCursos } from '../../../services/cursosService'
import { useEffect, useState } from 'react'
import { getProfesor } from '../../../services/profesorService'
import { capitalizarTexto } from '../../utils/capitalizarTexto'

const valoresIniciales = {
  nombre: '',
  descripcion: '',
  duracion: '',
  unidad: '',
  precio: '',
  cupos: '',
  idProfesor: '',
}

const useCursos = () => {
  const [feedback, setFeedback] = useState(null)
  const [accionEnProceso, setAccionEnProceso] = useState(null)
  const mostrarFeedback = (message, color = 'success') => {
    setFeedback({ message, color })
    setTimeout(() => {
      setFeedback(null)
    }, 4000)
  }
  const [cursoParaEliminar, setCursoParaEliminar] = useState(null)

  /// cargando los cursos para que se pueda seleeccionar
  const [profesor, setProfesor] = useState([])
  const cargarProfesor = async () => {
    try {
      const datosProfesor = await getProfesor()
      setProfesor(datosProfesor.data)
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al obtener profesores', 'danger')
    }
  }

  /// CARGANDO LOS CURSOS

  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)

  const cargarCursos = async () => {
    try {
      const res = await getCursos()
      setCursos(res.data)
    } catch (error) {
      console.error('Error al obtener cursos', error)
      mostrarFeedback('Error al obtener cursos', 'danger')
    }
  }

  useEffect(() => {
    let componenteActivo = true
    setCargando(true)

    Promise.allSettled([getCursos(), getProfesor()]).then((resultados) => {
      if (!componenteActivo) return
      if (resultados[0].status === 'fulfilled') {
        setCursos(resultados[0].value.data)
      } else {
        console.error('Error al obtener cursos', resultados[0].reason)
        mostrarFeedback('Error al obtener cursos', 'danger')
      }
      if (resultados[1].status === 'fulfilled') {
        setProfesor(resultados[1].value.data)
      } else {
        console.error(resultados[1].reason)
      }
      setCargando(false)
    })

    return () => {
      componenteActivo = false
    }
  }, [])

  ///CREAR CURSOS
  const [formulario, setFormulario] = useState({ ...valoresIniciales })
  const crearCurso = async (e) => {
    e.preventDefault()
    if (accionEnProceso) return
    if (!validarFormulario()) return
    setAccionEnProceso('guardar')
    try {
      const data = {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        duracion: Number(formulario.duracion),
        unidad: formulario.unidad,
        precio: Number(formulario.precio),
        cupos: Number(formulario.cupos),
        idProfesor: Number(formulario.idProfesor),
      }
      await postCursos(data)
      mostrarFeedback('Curso creado correctamente', 'success')
      setFormulario({ ...valoresIniciales })
      await cargarCursos()
      setErrores({})
      return true
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al registrar curso', 'danger')
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  const handleChange = (e) => {
    const valor =
      e.target.name === 'nombre'
        ? capitalizarTexto(e.target.value)
        : e.target.name === 'descripcion'
          ? e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase()
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

  ///EDITAR CURSOS
  const [editando, setEditando] = useState(false)
  const [idEditar, setIdEditar] = useState(null)

  const seleccionarCurso = (curso) => {
    const unidad =
      curso.duracion && typeof curso.duracion === 'object' ? Object.keys(curso.duracion)[0] : ''
    const duracion = unidad ? curso.duracion[unidad] : ''
    setFormulario({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      duracion,
      unidad,
      precio: curso.costo,
      cupos: curso.cupo_total,
      idProfesor: curso.id_profesor,
    })
    setEditando(true)
    setIdEditar(curso.id_curso)
  }

  const actualizarCurso = async (e) => {
    e.preventDefault()
    if (accionEnProceso) return
    if (!validarFormulario()) return
    setAccionEnProceso('actualizar')
    try {
      const data = {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        duracion: Number(formulario.duracion),
        unidad: formulario.unidad,
        precio: Number(formulario.precio),
        cupos: Number(formulario.cupos),
        idProfesor: Number(formulario.idProfesor),
      }
      await putCursos(idEditar, data)
      mostrarFeedback('Curso actualizado correctamente', 'success')
      setFormulario({ ...valoresIniciales })
      setEditando(false)
      setIdEditar(null)
      await cargarCursos()
      setErrores({})
      return true
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al actualizar curso', 'danger')
      return false
    } finally {
      setAccionEnProceso(null)
    }
  }

  /// DESCARTAR
  const descartar = () => {
    setEditando(false)
    setIdEditar(null)
    setFormulario({ ...valoresIniciales })
    mostrarFeedback('La edición fue cancelada', 'info')
  }

  ///ELIMINAR CURSO
  const eliminarCurso = (id) => {
    setCursoParaEliminar(id)
  }

  const cancelarEliminacion = () => {
    setCursoParaEliminar(null)
  }

  const confirmarEliminacion = async () => {
    if (!cursoParaEliminar) return
    if (accionEnProceso) return
    setAccionEnProceso('eliminar')

    try {
      await deleteCursos(cursoParaEliminar)
      mostrarFeedback('Curso eliminado correctamente', 'success')
      cargarCursos()
      cancelarEliminacion()
    } catch (error) {
      console.error(error)
      mostrarFeedback('Error al eliminar curso', 'danger')
    } finally {
      setAccionEnProceso(null)
    }
  }

  /// VALIDACION FORMULARIO

  const [errores, setErrores] = useState({})
  const validarFormulario = () => {
    const nuevosErrores = {}
    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    }
    if (formulario.descripcion && formulario.descripcion.length > 255) {
      nuevosErrores.descripcion = 'Máximo 255 carácteres'
    }
    if (formulario.duracion === '' || isNaN(Number(formulario.duracion))) {
      nuevosErrores.duracion = 'Duración es obligatoria'
    }
    if (!formulario.unidad) {
      nuevosErrores.unidad = 'Unidad es obligatorio'
    }
    if (formulario.precio === '' || isNaN(Number(formulario.precio))) {
      nuevosErrores.precio = 'Precio inválido'
    }
    if (formulario.cupos === '' || isNaN(Number(formulario.cupos))) {
      nuevosErrores.cupos = 'Cupos inválido'
    }
    if (formulario.idProfesor === '') {
      nuevosErrores.idProfesor = 'Profesor inválido'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  return {
    profesor,
    editando,
    formulario,
    errores,
    cursos,
    actualizarCurso,
    crearCurso,
    handleChange,
    descartar,
    seleccionarCurso,
    eliminarCurso,
    cursoParaEliminar,
    cancelarEliminacion,
    confirmarEliminacion,
    feedback,
    accionEnProceso,
    cargando,
    limpiarFeedback: () => setFeedback(null),
  }
}
export default useCursos
