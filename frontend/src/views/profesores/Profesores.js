import { useState } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import ProfesorFormulario from './componets/ProfesorFormulario'
import ProfesorTable from './componets/ProfesorTable'
import { useProfesores } from './hooks/useProfesores'
import { useHabilitarUsuario } from '../../hooks/useHabilitarUsuario'
import { FeedbackAlert, PageHeader } from '../../components'

const Profesores = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const {
    cargarProfesor,
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
    limpiarFeedback,
    accionEnProceso,
    limpiarEdicion,
  } = useProfesores()

  const { feedback1, ejecutarHabilitarUsuario } = useHabilitarUsuario()

  const guardarProfesor = async (event) => {
    const guardado = await crearProfesor(event)
    if (guardado) {
      setModalVisible(false)
    }
  }

  const actualizarProfesorDesdeModal = async (event) => {
    const actualizado = await actualizarProfesor(event)
    if (actualizado) {
      limpiarEdicion()
      setModalVisible(false)
    }
  }

  const seleccionarProfesorDesdeTabla = (profe) => {
    seleccionarProfesor(profe)
    setModalVisible(true)
  }

  const cancelarFormulario = () => {
    if (editando) {
      descartar()
    }
    setModalVisible(false)
  }

  return (
    <div className="profesores-page__container">
      <PageHeader
        eyebrow="Gestión académica"
        title="Profesores"
        description="Administra el equipo docente y sus especialidades."
        actions={
          <CButton
            color="primary"
            onClick={() => setModalVisible(true)}
            className="profesores-page__cta"
          >
            Registrar Profesor
          </CButton>
        }
      />
      {!modalVisible && (
        <FeedbackAlert feedback={feedback || feedback1} onClose={limpiarFeedback} />
      )}
      <ProfesorTable
        profesor={profesor}
        seleccionarProfesor={seleccionarProfesorDesdeTabla}
        eliminarProfesor={eliminarProfesor}
        profesorParaEliminar={profesorParaEliminar}
        cancelarEliminacion={cancelarEliminacion}
        confirmarEliminacion={confirmarEliminacion}
        accionEnProceso={accionEnProceso}
        feedback1={feedback1}
        ejecutarHabilitarUsuario={ejecutarHabilitarUsuario}
        cargarProfesor={cargarProfesor}
      />
      <CModal
        visible={modalVisible}
        onClose={cancelarFormulario}
        portal={false}
        size="xl"
        className="profesor-modal__wrapper"
      >
        <CModalHeader>
          <CModalTitle>{editando ? 'Editar profesor' : 'Registrar profesor'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <ProfesorFormulario
            handleChange={handleChange}
            descartar={cancelarFormulario}
            editando={editando}
            actualizarProfesor={actualizarProfesorDesdeModal}
            crearProfesor={guardarProfesor}
            formulario={formulario}
            errores={errores}
            accionEnProceso={accionEnProceso}
            feedback={feedback}
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
    </div>
  )
}

export default Profesores
