import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePreinscripcion } from './hooks/usePreinscripcion'
import PreinscripcionFormulario from './components/PreinscripcionFormulario'

const Register = () => {
  const navigate = useNavigate()
  const {
    formulario,
    crearPreinscripcion,
    handleChange,
    errores,
    feedback,
    limpiarFeedback,
    enviando,
  } = usePreinscripcion()

  useEffect(() => {
    if (feedback?.color !== 'success') {
      return undefined
    }

    const temporizador = setTimeout(() => {
      navigate('/login', { replace: true })
    }, 5000)

    return () => clearTimeout(temporizador)
  }, [feedback, navigate])

  const volverAlLogin = () => {
    limpiarFeedback()
    navigate('/login', { replace: true })
  }

  const cerrarFeedback = () => {
    limpiarFeedback()
    navigate('/login', { replace: true })
  }

  const feedbackVisible =
    feedback?.color === 'success'
      ? {
          ...feedback,
          message:
            '¡Preinscripción registrada con éxito! Para oficializar su inscripción definitiva y la asignación de horarios, por favor apersónese por las oficinas centrales de la academia.',
        }
      : feedback

  return (
    <PreinscripcionFormulario
      formulario={formulario}
      handleChange={handleChange}
      crearPreinscripcion={crearPreinscripcion}
      errores={errores}
      feedback={feedbackVisible}
      limpiarFeedback={cerrarFeedback}
      enviando={enviando}
      volverAlLogin={volverAlLogin}
    />
  )
}

export default Register
