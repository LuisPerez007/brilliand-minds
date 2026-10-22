import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { useInscripciones } from './hooks/useInscripciones.js'
import TablaInscripciones from './components/TablaInscripciones'
import TablaCursos from './components/TablaCursos.js'
import TablaProfesores from './components/tablaProfesores.js'
import { generarReporteInscripcionesPdf } from '../utils/generarReporteInscripcionesPdf.js'
import { FeedbackAlert } from '../../components'
import { useEffect, useState } from 'react'

import '../../scss/contenedorStyles/contenedores.scss'
import '../../scss/textoStyles/textos.scss'
import '../../scss/formaStyles/selectStyle.scss'
import '../../scss/formaStyles/buttonStyle.scss'

const Inscripciones = () => {
  const {
    eliminarInscripcionPorCurso,
    cursoParaEliminar,
    cancelarEliminacionCurso,
    confirmarEliminacionCurso,
    profes,
    cargarProfesores,
    inscripcionesPorProfesor,
    cargarInscripcionesPorProfesor,

    inscripcionesPorCurso,
    cargarInscripcionesPorCurso,
    cursos,
    cargarCursos,
    inscripciones,
    cargarInscripcion,
    eliminarInscripcionId,
    inscripcionParaEliminar,
    cancelarEliminacion,
    confirmarEliminacion,
    eliminacionEnProceso,
    feedback,
    limpiarFeedback,
    cargando,
  } = useInscripciones()

  const [vista, setVista] = useState(null)
  const [idCursoSeleccionado, setIdCursoSeleccionado] = useState('')

  const [idProfesorSeleccionado, setIdProfesorSeleccionado] = useState('')
  const [generandoReporte, setGenerandoReporte] = useState(false)

  const handleVista = async (tipo) => {
    setVista(tipo)

    if (tipo === 'inscripciones') {
      await cargarInscripcion()
    }
    if (tipo === 'profesores') {
      await cargarProfesores()
    }
  }

  useEffect(() => {
    cargarCursos()
    cargarProfesores()
  }, [cargarCursos, cargarProfesores])

  useEffect(() => {
    if (vista === 'profesores' && idProfesorSeleccionado !== '') {
      cargarInscripcionesPorProfesor(idProfesorSeleccionado)
    }
  }, [vista, idProfesorSeleccionado, cargarInscripcionesPorProfesor])

  useEffect(() => {
    if (vista === 'curso' && idCursoSeleccionado !== '') {
      cargarInscripcionesPorCurso(idCursoSeleccionado)
    }
  }, [vista, idCursoSeleccionado, cargarInscripcionesPorCurso])

  const imprimirReporte = async () => {
    if (!vista) {
      mostrarFeedback('No hay un reporte seleccionado para imprimir.', 'warning')
      return
    }
    if (vista === 'curso' && idCursoSeleccionado === '') {
      mostrarFeedback('Seleccione un curso antes de imprimir el reporte.', 'warning')
      return
    }
    if (vista === 'profesores' && idProfesorSeleccionado === '') {
      mostrarFeedback('Seleccione un profesor antes de imprimir el reporte.', 'warning')
      return
    }

    setGenerandoReporte(true)
    try {
      const reporte =
        vista === 'inscripciones'
          ? {
              tipo: vista,
              datos: inscripciones,
              titulo: 'REPORTE DE INSCRIPCIONES',
              subtitulo: 'Listado general de inscripciones',
            }
          : vista === 'curso'
            ? {
                tipo: vista,
                datos: inscripcionesPorCurso?.data || [],
                titulo: 'REPORTE POR CURSO',
                subtitulo: `Curso: ${inscripcionesPorCurso?.data?.[0]?.curso || 'Sin datos'}`,
              }
            : {
                tipo: vista,
                datos: inscripcionesPorProfesor?.datos || [],
                titulo: 'REPORTE POR PROFESOR',
                subtitulo: `Profesor: ${inscripcionesPorProfesor?.datos?.[0]?.profesor || 'Sin datos'}`,
              }

      generarReporteInscripcionesPdf(reporte)
    } finally {
      setGenerandoReporte(false)
    }
  }

  return (
    <div className="inscripciones-page__container">
      <FeedbackAlert feedback={feedback} onClose={limpiarFeedback} />

      <div className="inscripciones-toolbar__panel">
        <h1 className="inscripciones-page__title">Lista de Consultas</h1>

        <div className="inscripciones-toolbar__actions">
          <button
            className="inscripcion-filter__button"
            onClick={() => handleVista('inscripciones')}
          >
            Inscripciones
          </button>
          <button className="inscripcion-filter__button" onClick={() => handleVista('curso')}>
            Cursos
          </button>
          <button className="inscripcion-filter__button" onClick={() => handleVista('profesores')}>
            Profesores
          </button>
          <button
            className="inscripcion-filter__button inscripcion-filter__button--primary"
            onClick={imprimirReporte}
            disabled={Boolean(cargando) || generandoReporte}
          >
            {generandoReporte ? 'Generando...' : 'Imprimir reporte'}
          </button>
        </div>
      </div>

      {vista === 'profesores' && (
        <div className="inscripcion-filter__panel">
          <label className="inscripcion-filter__label" htmlFor="inscripcion-profesor-select">
            Seleccionar profesor
          </label>
          <select
            id="inscripcion-profesor-select"
            className="inscripcion-form__input inscripcion-form__select selector-tipo__wrapper"
            aria-label="Seleccionar profesor"
            value={idProfesorSeleccionado || ''}
            onChange={(e) => {
              const value = e.target.value
              const id = value === '' ? '' : Number(value)
              setIdProfesorSeleccionado(id)
              console.log('id profesor seleccionado: ', id)
            }}
          >
            <option value="">Seleccione un profesor</option>
            {profes
              .filter((pro) => pro.estado === 'Activo')
              .map((prof) => (
                <option key={prof.id_profesor} value={prof.id_profesor}>
                  {prof.nombre} {prof.a_paterno} {prof.a_materno}
                </option>
              ))}
          </select>
          {idProfesorSeleccionado !== '' && (
            <TablaProfesores
              inscripcionesPorProfesor={inscripcionesPorProfesor}
              eliminarInscripcionId={eliminarInscripcionId}
              idProfesorSeleccionado={idProfesorSeleccionado}
              cargando={cargando}
              inscripcionParaEliminar={inscripcionParaEliminar}
              eliminarInscripcionPorCurso={eliminarInscripcionPorCurso}
              cursoParaEliminar={cursoParaEliminar}
              cancelarEliminacionCurso={cancelarEliminacionCurso}
              confirmarEliminacionCurso={confirmarEliminacionCurso}
            />
          )}
        </div>
      )}

      {vista === 'inscripciones' && (
        <TablaInscripciones
          inscripciones={inscripciones}
          eliminarInscripcionId={eliminarInscripcionId}
        />
      )}

      {vista === 'curso' && (
        <div className="inscripcion-filter__panel">
          <label className="inscripcion-filter__label" htmlFor="inscripcion-curso-select">
            Seleccionar curso
          </label>
          <select
            id="inscripcion-curso-select"
            className="inscripcion-form__input inscripcion-form__select"
            aria-label="Seleccionar curso"
            value={idCursoSeleccionado || ''}
            onChange={(e) => {
              const value = e.target.value
              const id = value === '' ? '' : Number(value)

              setIdCursoSeleccionado(id)
              console.log('id curso:', id)
            }}
          >
            <option value="">Seleccione un curso</option>

            {cursos
              .filter((cur) => cur.estado === 'Activo')
              .map((cur) => (
                <option key={cur.id_curso} value={cur.id_curso}>
                  {cur.nombre}
                </option>
              ))}
          </select>

          {idCursoSeleccionado !== '' && (
            <TablaCursos
              inscripcionesPorCurso={inscripcionesPorCurso}
              eliminarInscripcionId={eliminarInscripcionId}
            />
          )}
        </div>
      )}
      <CModal
        visible={Boolean(inscripcionParaEliminar)}
        onClose={cancelarEliminacion}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Eliminar inscripción</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Esta acción eliminará la inscripción seleccionada. ¿Deseas continuar?
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={cancelarEliminacion}
            disabled={eliminacionEnProceso}
          >
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmarEliminacion} disabled={eliminacionEnProceso}>
            {eliminacionEnProceso ? (
              <>
                <CSpinner size="sm" className="me-1" /> Procesando
              </>
            ) : (
              'Sí, eliminar'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Inscripciones
