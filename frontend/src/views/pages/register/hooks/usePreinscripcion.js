import { useState } from 'react'
import { postPreinscripcionEstudiante } from '../../../../services/preInscripcionEstudianteRoutes'
import { capitalizarTexto } from '../../../utils/capitalizarTexto'

export const usePreinscripcion = () => {
  const valoresIniciales = {
    nombre: '',
    a_paterno: '',
    a_materno: '',
    ci: '',
    direccion: '',
    colegio: '',
    telefono: '',
    email: '',
  }

  const [formulario, setFormulario] = useState({ ...valoresIniciales })
  const [feedback, setFeedback] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const limpiarFeedback = () => setFeedback(null)

  const crearPreinscripcion = async (e) => {
    e.preventDefault()
    if (!validarFormulario()) {
      return
    }
    setEnviando(true)
    setFeedback(null)
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
      }
      await postPreinscripcionEstudiante(data)
      setFeedback({
        message: '¡Preinscripción enviada con éxito! La administración revisará tu solicitud.',
        color: 'success',
      })
      setFormulario({ ...valoresIniciales })
      setErrores({})
    } catch (error) {
      console.error(error.response?.data?.message)
      const msg = error.response?.data?.message || 'Error al enviar la solicitud al servidor.'
      setFeedback({ message: msg, color: 'danger' })
    } finally {
      setEnviando(false)
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
    if (formulario.email && !/\S+@\S+\.\S+/.test(formulario.email)) {
      nuevosErrores.email = 'Email inválido'
    }
    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  return {
    formulario,
    crearPreinscripcion,
    handleChange,
    errores,
    feedback,
    limpiarFeedback,
    enviando,
  }
}
