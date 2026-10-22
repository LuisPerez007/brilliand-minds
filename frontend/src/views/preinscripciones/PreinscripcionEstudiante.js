import { useState } from 'react'
import {
  CButton,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import PreinscripcionTable from './components/PreinscripcionTable'
import { usePreinscripciones } from './hooks/usePreinscripciones'
import PadreTutorFormulario from '../padreTutor/components/PadreTutorFormulario'
import { usePadreTutor } from '../padreTutor/hooks/usePadreTutor'
import { FeedbackAlert, PageHeader } from '../../components'

const PreinscripcionEstudiante = () => {
  const [solicitudParaAprobar, setSolicitudParaAprobar] = useState(null)
  const [paso, setPaso] = useState(1)
  const [ciPadreTutor, setCiPadreTutor] = useState('')
  const [padreTutorSeleccionado, setPadreTutorSeleccionado] = useState(null)
  const [errorPadreTutor, setErrorPadreTutor] = useState('')
  const {
    aceptarSolicitud,
    rechazarSolicitud,
    cargarPreinscripciones,
    preinscripciones,
    feedback,
    cargando,
    limpiarFeedback,
    solicitudEnProceso,
  } = usePreinscripciones()
  const {
    padresTutores,
    formulario: formularioPadreTutor,
    errores: erroresPadreTutor,
    editando: editandoPadreTutor,
    handleChange: handleChangePadreTutor,
    crearPadreTutor,
    actualizarPadreTutor,
    descartar: descartarPadreTutor,
    accionEnProceso: accionPadreTutorEnProceso,
    cargarPadresTutores,
  } = usePadreTutor()

  const abrirModalAprobacion = (idSolicitud) => {
    const solicitud = preinscripciones.find((item) => item.id === idSolicitud)
    setSolicitudParaAprobar(solicitud || null)
    setPaso(1)
    setCiPadreTutor('')
    setPadreTutorSeleccionado(null)
    setErrorPadreTutor('')
  }

  const buscarPadreTutor = () => {
    const encontrado = padresTutores.find(
      (padreTutor) => String(padreTutor.ci) === ciPadreTutor.trim(),
    )
    setPadreTutorSeleccionado(encontrado || null)
    setErrorPadreTutor(encontrado ? '' : 'No se encontró un padre o tutor con ese CI')
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

  const registrarPadreTutorDesdeModal = async (event) => {
    const ciRegistrado = formularioPadreTutor.ci
    const registrado = await crearPadreTutor(event)
    if (registrado) {
      const padresActualizados = await cargarPadresTutores()
      const padreTutor = padresActualizados?.find(
        (padre) => String(padre.ci) === String(ciRegistrado),
      )
      setPadreTutorSeleccionado(padreTutor || null)
      setCiPadreTutor(String(ciRegistrado || ''))
      setErrorPadreTutor(padreTutor ? '' : 'No se pudo seleccionar el padre o tutor registrado')
      cerrarRegistroPadreTutor()
    }
  }

  const confirmarAprobacion = async () => {
    if (!solicitudParaAprobar || !padreTutorSeleccionado) {
      setErrorPadreTutor('Debe seleccionar un padre o tutor')
      return
    }
    const aprobada = await aceptarSolicitud(
      solicitudParaAprobar.id,
      padreTutorSeleccionado.id_tutor || padreTutorSeleccionado.idTutor,
    )
    if (aprobada) {
      setSolicitudParaAprobar(null)
      setPadreTutorSeleccionado(null)
    }
  }

  const nombreCompletoPadreTutor = (padreTutor) =>
    [
      padreTutor?.nombre,
      padreTutor?.apellidoPaterno ?? padreTutor?.a_paterno,
      padreTutor?.apellidoMaterno ?? padreTutor?.a_materno,
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <div className="preinscripciones-page__container">
      <PageHeader
        eyebrow="Admisiones"
        title="Preinscripciones"
        description="Revisa y gestiona las solicitudes de nuevos estudiantes."
      />
      <FeedbackAlert feedback={solicitudParaAprobar ? null : feedback} onClose={limpiarFeedback} />
      <PreinscripcionTable
        preinscripciones={preinscripciones}
        rechazarSolicitud={rechazarSolicitud}
        aceptarSolicitud={abrirModalAprobacion}
        solicitudEnProceso={solicitudEnProceso}
        cargando={cargando}
      />
      <CModal
        visible={Boolean(solicitudParaAprobar)}
        onClose={() => {
          setSolicitudParaAprobar(null)
          setPaso(1)
        }}
        backdrop="static"
        alignment="center"
        size="lg"
        className="preinscripcion-modal__dialog"
      >
        <CModalHeader closeButton className="preinscripcion-modal__header">
          <CModalTitle>
            {paso === 2 ? 'Registrar Padre o Tutor' : 'Asignar Padre/Tutor para Aprobación'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="preinscripcion-modal__body">
          <FeedbackAlert
            feedback={solicitudParaAprobar ? feedback : null}
            onClose={limpiarFeedback}
          />
          {paso === 1 ? (
            <>
              <div className="preinscripcion-form__card">
                <p className="preinscripcion-form__description">
                  Asigna un padre o tutor a <strong>{solicitudParaAprobar?.nombre}</strong> antes de
                  aprobar la solicitud.
                </p>
                <CFormLabel
                  htmlFor="preinscripcion-padre-tutor-ci"
                  className="preinscripcion-form__label"
                >
                  CI del padre o tutor
                </CFormLabel>
                <div className="preinscripcion-form__row">
                  <CFormInput
                    id="preinscripcion-padre-tutor-ci"
                    value={ciPadreTutor}
                    onChange={(event) => setCiPadreTutor(event.target.value)}
                    placeholder="Ingrese el CI del padre o tutor"
                    invalid={Boolean(errorPadreTutor)}
                    className="preinscripcion-form__input"
                  />
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={buscarPadreTutor}
                    className="preinscripcion-form__button"
                  >
                    Buscar
                  </CButton>
                </div>
                {errorPadreTutor && <CFormFeedback invalid>{errorPadreTutor}</CFormFeedback>}
                {padreTutorSeleccionado ? (
                  <div className="preinscripcion-form__selection">
                    <strong>Padre/tutor seleccionado:</strong>{' '}
                    {nombreCompletoPadreTutor(padreTutorSeleccionado)} (CI:{' '}
                    {padreTutorSeleccionado.ci})
                  </div>
                ) : (
                  <CButton
                    color="warning"
                    variant="ghost"
                    className="preinscripcion-form__link px-0 mt-3"
                    onClick={abrirRegistroPadreTutor}
                  >
                    No existe padre/tutor. Registrar primero
                  </CButton>
                )}
              </div>
            </>
          ) : (
            <PadreTutorFormulario
              formulario={formularioPadreTutor}
              errores={erroresPadreTutor}
              editando={editandoPadreTutor}
              handleChange={handleChangePadreTutor}
              crearPadreTutor={registrarPadreTutorDesdeModal}
              actualizarPadreTutor={actualizarPadreTutor}
              descartar={cerrarRegistroPadreTutor}
              accionEnProceso={accionPadreTutorEnProceso}
            />
          )}
        </CModalBody>
        <CModalFooter className="preinscripcion-modal__footer">
          <CButton
            color="secondary"
            variant="outline"
            onClick={paso === 2 ? cerrarRegistroPadreTutor : () => setSolicitudParaAprobar(null)}
            disabled={Boolean(paso === 2 ? accionPadreTutorEnProceso : solicitudEnProceso)}
          >
            Cancelar
          </CButton>
          {paso === 1 && (
            <CButton
              color="success"
              onClick={confirmarAprobacion}
              disabled={Boolean(solicitudEnProceso) || !padreTutorSeleccionado}
            >
              {solicitudEnProceso?.tipo === 'aprobar' ? (
                <>
                  <CSpinner size="sm" className="me-1" /> Procesando
                </>
              ) : (
                'Confirmar y Aprobar'
              )}
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PreinscripcionEstudiante
