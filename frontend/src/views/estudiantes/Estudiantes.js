import { useEffect, useRef, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import EstudianteFormulario from './components/EstudianteFormulario'
import EstudianteTable from './components/EstudianteTable'
import { useEstudiantes } from './hooks/useEstudiantes'
import PadreTutorFormulario from '../padreTutor/components/PadreTutorFormulario'
import { usePadreTutor } from '../padreTutor/hooks/usePadreTutor'
import PreinscripcionTable from '../preinscripciones/components/PreinscripcionTable'
import { usePreinscripciones } from '../preinscripciones/hooks/usePreinscripciones'
import { PageHeader } from '../../components'

const Estudiantes = () => {
  const feedbackRef = useRef(null)
  const [modalRegistroVisible, setModalRegistroVisible] = useState(false)
  const [paso, setPaso] = useState(1)
  const [mostrarPreinscripciones, setMostrarPreinscripciones] = useState(false)
  const [solicitudParaAprobar, setSolicitudParaAprobar] = useState(null)
  const [pasoAprobacion, setPasoAprobacion] = useState(1)
  const [ciPadreTutorAprobacion, setCiPadreTutorAprobacion] = useState('')
  const [padreTutorAprobacion, setPadreTutorAprobacion] = useState(null)
  const [errorPadreTutorAprobacion, setErrorPadreTutorAprobacion] = useState('')
  const {
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
    limpiarFeedback,
    accionEnProceso,
    cargando,
    ciPadreTutorBusqueda,
    setCiPadreTutorBusqueda,
    padreTutorSeleccionado,
    buscarPadreTutor,
    asignarPadreTutor,
  } = useEstudiantes()
  const {
    formulario: formularioPadreTutor,
    errores: erroresPadreTutor,
    editando: editandoPadreTutor,
    handleChange: handleChangePadreTutor,
    crearPadreTutor,
    actualizarPadreTutor,
    descartar: descartarPadreTutor,
    accionEnProceso: accionPadreTutorEnProceso,
    padresTutores,
    cargarPadresTutores,
  } = usePadreTutor()
  const {
    aceptarSolicitud,
    rechazarSolicitud,
    preinscripciones,
    feedback: feedbackPreinscripciones,
    cargando: cargandoPreinscripciones,
    limpiarFeedback: limpiarFeedbackPreinscripciones,
    solicitudEnProceso,
  } = usePreinscripciones()

  useEffect(() => {
    if (!feedback) return

    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [feedback])

  const abrirAprobacion = (idSolicitud) => {
    const solicitud = preinscripciones.find((item) => item.id === idSolicitud)
    setSolicitudParaAprobar(solicitud || null)
    setPasoAprobacion(1)
    setCiPadreTutorAprobacion('')
    setPadreTutorAprobacion(null)
    setErrorPadreTutorAprobacion('')
  }

  const buscarPadreTutorAprobacion = () => {
    const encontrado = padresTutores.find(
      (padreTutor) => String(padreTutor.ci) === ciPadreTutorAprobacion.trim(),
    )
    setPadreTutorAprobacion(encontrado || null)
    setErrorPadreTutorAprobacion(encontrado ? '' : 'No se encontró un padre o tutor con ese CI')
  }

  const registrarPadreTutorParaAprobacion = async (event) => {
    const ci = formularioPadreTutor.ci
    const registrado = await crearPadreTutor(event)
    if (registrado) {
      const padresActualizados = await cargarPadresTutores()
      const padreTutor = padresActualizados?.find((padre) => String(padre.ci) === String(ci))
      setPadreTutorAprobacion(padreTutor || null)
      setCiPadreTutorAprobacion(String(ci || ''))
      setErrorPadreTutorAprobacion(
        padreTutor ? '' : 'No se pudo seleccionar el padre o tutor registrado',
      )
      setPasoAprobacion(1)
    }
  }

  const confirmarAprobacion = async () => {
    if (!solicitudParaAprobar || !padreTutorAprobacion) {
      setErrorPadreTutorAprobacion('Debe seleccionar un padre o tutor')
      return
    }

    const aprobada = await aceptarSolicitud(
      solicitudParaAprobar.id,
      padreTutorAprobacion.id_tutor || padreTutorAprobacion.idTutor,
    )

    if (aprobada) {
      await cargarEstudiantes()
      setSolicitudParaAprobar(null)
      setPadreTutorAprobacion(null)
      setMostrarPreinscripciones(false)
    }
  }

  const registrarEstudiante = async (event) => {
    const registrado = await crearEstudiante(event)
    if (registrado) {
      setModalRegistroVisible(false)
    }
  }

  const actualizarEstudianteDesdeModal = async (event) => {
    const actualizado = await actualizarEstudiante(event)
    if (actualizado) {
      setModalRegistroVisible(false)
    }
  }

  const seleccionarEstudianteDesdeTabla = (estudiante) => {
    seleccionarEstudiante(estudiante)
    setPaso(1)
    setModalRegistroVisible(true)
  }

  const cancelarRegistro = () => {
    if (editando) {
      descartar()
    }
    setPaso(1)
    setModalRegistroVisible(false)
  }

  const abrirRegistroPadreTutor = () => {
    descartarPadreTutor()
    setPaso(2)
  }

  const cerrarRegistroPadreTutor = () => {
    if (accionPadreTutorEnProceso) return
    descartarPadreTutor()
    setPaso(1)
  }

  const registrarPadreTutorDesdeEstudiante = async (event) => {
    const ci = formularioPadreTutor.ci
    const registrado = await crearPadreTutor(event)
    if (registrado) {
      const padresActualizados = await cargarPadresTutores()
      const padreTutor = padresActualizados?.find((padre) => String(padre.ci) === String(ci))
      if (padreTutor) asignarPadreTutor(padreTutor)
      cerrarRegistroPadreTutor()
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={mostrarPreinscripciones ? 'Admisiones' : 'Gestión académica'}
        title={mostrarPreinscripciones ? 'Preinscripciones' : 'Estudiantes'}
        description={
          mostrarPreinscripciones
            ? 'Revisa y gestiona las solicitudes de nuevos estudiantes.'
            : 'Administra los estudiantes registrados y sus inscripciones.'
        }
        actions={
          mostrarPreinscripciones ? (
            <CButton color="secondary" onClick={() => setMostrarPreinscripciones(false)}>
              ← Volver a Lista de Estudiantes
            </CButton>
          ) : (
            <div className="d-flex gap-2">
              <CButton color="primary" onClick={() => setModalRegistroVisible(true)}>
                Registrar Estudiante
              </CButton>
              <CButton color="secondary" onClick={() => setMostrarPreinscripciones(true)}>
                Ver Preinscripciones
                <CBadge color="danger" shape="rounded-pill" className="ms-2">
                  {preinscripciones.length}
                </CBadge>
              </CButton>
            </div>
          )
        }
      />
      {feedback && (
        <div ref={feedbackRef}>
          <CAlert color={feedback.color} dismissible onClose={limpiarFeedback}>
            {feedback.message}
          </CAlert>
        </div>
      )}
      {mostrarPreinscripciones ? (
        <>
          {feedbackPreinscripciones && !solicitudParaAprobar && (
            <CAlert
              color={feedbackPreinscripciones.color}
              dismissible
              onClose={limpiarFeedbackPreinscripciones}
            >
              {feedbackPreinscripciones.message}
            </CAlert>
          )}
          <PreinscripcionTable
            preinscripciones={preinscripciones}
            rechazarSolicitud={rechazarSolicitud}
            aceptarSolicitud={abrirAprobacion}
            solicitudEnProceso={solicitudEnProceso}
            cargando={cargandoPreinscripciones}
          />
        </>
      ) : (
        <EstudianteTable
          cargando={cargando}
          crearInscripcion={crearInscripcion}
          cursos={cursos}
          handleCursos={handleCursos}
          cursosSeleccionados={cursosSeleccionados}
          estudianteSeleccionado={estudianteSeleccionado}
          modalInscripcion={modalInscripcion}
          abrirModalInscripcion={abrirModalInscripcion}
          cerrarModalInscripcion={cerrarModalInscripcion}
          estudiantes={estudiantes}
          cargarEstudiantes={cargarEstudiantes}
          seleccionarEstudiante={seleccionarEstudianteDesdeTabla}
          eliminarEstudiante={eliminarEstudiante}
          estudianteParaEliminar={estudianteParaEliminar}
          cancelarEliminacion={cancelarEliminacion}
          confirmarEliminacion={confirmarEliminacion}
          accionEnProceso={accionEnProceso}
          mostrarCursosPorEstudiante={mostrarCursosPorEstudiante}
          seleccionados={seleccionados}
        />
      )}
      <CModal
        visible={modalRegistroVisible}
        onClose={paso === 2 ? cerrarRegistroPadreTutor : cancelarRegistro}
        backdrop="static"
        portal={false}
        alignment="center"
        size="xl"
      >
        <CModalHeader closeButton>
          <CModalTitle>
            {paso === 2
              ? 'Registrar Padre o Tutor'
              : editando
                ? 'Editar Estudiante'
                : 'Registrar Estudiante'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {paso === 1 ? (
            <EstudianteFormulario
              formulario={formulario}
              errores={errores}
              editando={editando}
              handleChange={handleChange}
              crearEstudiante={registrarEstudiante}
              actualizarEstudiante={actualizarEstudianteDesdeModal}
              descartar={cancelarRegistro}
              accionEnProceso={accionEnProceso}
              ciPadreTutorBusqueda={ciPadreTutorBusqueda}
              setCiPadreTutorBusqueda={setCiPadreTutorBusqueda}
              buscarPadreTutor={buscarPadreTutor}
              padreTutorSeleccionado={padreTutorSeleccionado}
              abrirRegistroPadreTutor={abrirRegistroPadreTutor}
            />
          ) : (
            <PadreTutorFormulario
              formulario={formularioPadreTutor}
              errores={erroresPadreTutor}
              editando={editandoPadreTutor}
              handleChange={handleChangePadreTutor}
              crearPadreTutor={registrarPadreTutorDesdeEstudiante}
              actualizarPadreTutor={actualizarPadreTutor}
              descartar={cerrarRegistroPadreTutor}
              accionEnProceso={accionPadreTutorEnProceso}
            />
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={paso === 2 ? cerrarRegistroPadreTutor : cancelarRegistro}
            disabled={Boolean(paso === 2 ? accionPadreTutorEnProceso : accionEnProceso)}
          >
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        visible={Boolean(solicitudParaAprobar)}
        onClose={() => setSolicitudParaAprobar(null)}
        backdrop="static"
        portal={false}
        alignment="center"
        size="lg"
      >
        <div
          data-coreui-theme="dark"
          style={{ backgroundColor: '#2a2b36', color: '#fff' }}
          className="w-100 h-100 rounded"
        >
          <CModalHeader closeButton>
            <CModalTitle>
              {pasoAprobacion === 2
                ? 'Registrar Padre o Tutor'
                : 'Asignar Padre/Tutor para Aprobación'}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {feedbackPreinscripciones && solicitudParaAprobar && (
              <CAlert
                color={feedbackPreinscripciones.color}
                dismissible
                onClose={limpiarFeedbackPreinscripciones}
              >
                {feedbackPreinscripciones.message}
              </CAlert>
            )}
            {pasoAprobacion === 1 ? (
              <>
                <p className="text-body-secondary">
                  Asigna un padre o tutor a <strong>{solicitudParaAprobar?.nombre}</strong> antes de
                  aprobar la solicitud.
                </p>
                <CFormLabel htmlFor="estudiantes-aprobacion-padre-ci">
                  CI del padre o tutor
                </CFormLabel>
                <div className="d-flex gap-2">
                  <CFormInput
                    id="estudiantes-aprobacion-padre-ci"
                    value={ciPadreTutorAprobacion}
                    onChange={(event) => setCiPadreTutorAprobacion(event.target.value)}
                    invalid={Boolean(errorPadreTutorAprobacion)}
                  />
                  <CButton color="primary" variant="outline" onClick={buscarPadreTutorAprobacion}>
                    Buscar
                  </CButton>
                </div>
                {errorPadreTutorAprobacion && (
                  <CAlert color="warning" className="mt-2 mb-0">
                    {errorPadreTutorAprobacion}
                  </CAlert>
                )}
                {padreTutorAprobacion ? (
                  <CAlert color="success" className="mt-3 mb-0">
                    Padre/tutor seleccionado: {padreTutorAprobacion.nombre}{' '}
                    {padreTutorAprobacion.apellidoPaterno || padreTutorAprobacion.a_paterno} (CI:{' '}
                    {padreTutorAprobacion.ci})
                  </CAlert>
                ) : (
                  <CButton
                    color="warning"
                    variant="ghost"
                    className="px-0 mt-3"
                    onClick={() => {
                      descartarPadreTutor()
                      setPasoAprobacion(2)
                    }}
                  >
                    No existe padre/tutor. Registrar primero
                  </CButton>
                )}
              </>
            ) : (
              <PadreTutorFormulario
                formulario={formularioPadreTutor}
                errores={erroresPadreTutor}
                editando={editandoPadreTutor}
                handleChange={handleChangePadreTutor}
                crearPadreTutor={registrarPadreTutorParaAprobacion}
                actualizarPadreTutor={actualizarPadreTutor}
                descartar={() => {
                  if (!accionPadreTutorEnProceso) {
                    descartarPadreTutor()
                    setPasoAprobacion(1)
                  }
                }}
                accionEnProceso={accionPadreTutorEnProceso}
              />
            )}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => {
                if (pasoAprobacion === 2) {
                  descartarPadreTutor()
                  setPasoAprobacion(1)
                } else {
                  setSolicitudParaAprobar(null)
                }
              }}
              disabled={Boolean(
                pasoAprobacion === 2 ? accionPadreTutorEnProceso : solicitudEnProceso,
              )}
            >
              Cancelar
            </CButton>
            {pasoAprobacion === 1 && (
              <CButton
                color="success"
                onClick={confirmarAprobacion}
                disabled={Boolean(solicitudEnProceso) || !padreTutorAprobacion}
              >
                Confirmar y Aprobar
              </CButton>
            )}
          </CModalFooter>
        </div>
      </CModal>
    </>
  )
}

export default Estudiantes
