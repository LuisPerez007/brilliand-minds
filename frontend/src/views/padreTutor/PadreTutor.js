import { useState } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { FeedbackAlert, PageHeader } from '../../components'
import PadreTutorFormulario from './components/PadreTutorFormulario'
import PadreTutorTable from './components/PadreTutorTable'
import { usePadreTutor } from './hooks/usePadreTutor'

const PadreTutor = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const {
    padresTutores,
    cargando,
    formulario,
    errores,
    editando,
    accionEnProceso,
    padreTutorParaEliminar,
    handleChange,
    crearPadreTutor,
    actualizarPadreTutor,
    seleccionarPadreTutor,
    eliminarPadreTutor,
    cancelarEliminacion,
    confirmarEliminacion,
    descartar,
    feedback,
    limpiarFeedback,
  } = usePadreTutor()

  const abrirRegistro = () => {
    descartar()
    setModalVisible(true)
  }

  const guardarPadreTutor = async (event) => {
    const guardado = await crearPadreTutor(event)
    if (guardado) setModalVisible(false)
  }

  const actualizarPadreTutorDesdeModal = async (event) => {
    const actualizado = await actualizarPadreTutor(event)
    if (actualizado) setModalVisible(false)
  }

  const seleccionarPadreTutorDesdeTabla = (padreTutor) => {
    seleccionarPadreTutor(padreTutor)
    setModalVisible(true)
  }

  const cancelarFormulario = () => {
    if (accionEnProceso) return
    descartar()
    setModalVisible(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="Gestión académica"
        title="Padres y Tutores"
        description="Administra los padres y tutores registrados en el sistema."
        actions={
          <CButton color="primary" onClick={abrirRegistro}>
            Registrar Padre o Tutor
          </CButton>
        }
      />

      <FeedbackAlert feedback={feedback} onClose={limpiarFeedback} />

      <PadreTutorTable
        padresTutores={padresTutores}
        cargando={cargando}
        seleccionarPadreTutor={seleccionarPadreTutorDesdeTabla}
        eliminarPadreTutor={eliminarPadreTutor}
        padreTutorParaEliminar={padreTutorParaEliminar}
        cancelarEliminacion={cancelarEliminacion}
        confirmarEliminacion={confirmarEliminacion}
        accionEnProceso={accionEnProceso}
      />

      <CModal visible={modalVisible} onClose={cancelarFormulario} size="xl">
        <CModalHeader>
          <CModalTitle>{editando ? 'Editar padre o tutor' : 'Registrar padre o tutor'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <PadreTutorFormulario
            handleChange={handleChange}
            descartar={cancelarFormulario}
            editando={editando}
            actualizarPadreTutor={actualizarPadreTutorDesdeModal}
            crearPadreTutor={guardarPadreTutor}
            formulario={formulario}
            errores={errores}
            accionEnProceso={accionEnProceso}
          />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={cancelarFormulario}
            disabled={Boolean(accionEnProceso)}
          >
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default PadreTutor
