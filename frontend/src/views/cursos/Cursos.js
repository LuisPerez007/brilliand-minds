import { useState } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import useCursos from './hooks/useCursos'
import CursoFormulario from './components/CursoFormulario'
import CursoTable from './components/CursoTable'
import { FeedbackAlert, PageHeader } from '../../components'

const Cursos = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const {
    profesor,
    editando,
    actualizarCurso,
    crearCurso,
    formulario,
    handleChange,
    errores,
    descartar,
    cursos,
    seleccionarCurso,
    eliminarCurso,
    cursoParaEliminar,
    cancelarEliminacion,
    confirmarEliminacion,
    feedback,
    limpiarFeedback,
    accionEnProceso,
  } = useCursos()

  const registrarCurso = async (event) => {
    const registrado = await crearCurso(event)
    if (registrado) {
      setModalVisible(false)
    }
  }

  const actualizarCursoDesdeModal = async (event) => {
    const actualizado = await actualizarCurso(event)
    if (actualizado) {
      setModalVisible(false)
    }
  }

  const seleccionarCursoDesdeTabla = (curso) => {
    seleccionarCurso(curso)
    setModalVisible(true)
  }

  const cancelarFormulario = () => {
    if (editando) {
      descartar()
    }
    setModalVisible(false)
  }

  return (
    <>
      <PageHeader
        eyebrow="Gestión académica"
        title="Cursos"
        description="Organiza la oferta académica, sus profesores y cupos disponibles."
        actions={
          <CButton color="primary" onClick={() => setModalVisible(true)}>
            Registrar Curso
          </CButton>
        }
      />
      <FeedbackAlert feedback={feedback} onClose={limpiarFeedback} />
      <CursoTable
        cursos={cursos}
        seleccionarCurso={seleccionarCursoDesdeTabla}
        eliminarCurso={eliminarCurso}
        cursoParaEliminar={cursoParaEliminar}
        cancelarEliminacion={cancelarEliminacion}
        confirmarEliminacion={confirmarEliminacion}
        accionEnProceso={accionEnProceso}
      />
      <CModal visible={modalVisible} onClose={cancelarFormulario} portal={false} size="xl">
        <CModalHeader>
          <CModalTitle>{editando ? 'Editar Curso' : 'Registrar Curso'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CursoFormulario
            profesor={profesor}
            editando={editando}
            actualizarCurso={actualizarCursoDesdeModal}
            crearCurso={registrarCurso}
            formulario={formulario}
            handleChange={handleChange}
            errores={errores}
            descartar={cancelarFormulario}
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

export default Cursos
