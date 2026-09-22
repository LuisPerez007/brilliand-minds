import { useEffect, useState } from 'react'
import { CCol, CRow, CSpinner, CWidgetStatsA } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBook, cilCash, cilPeople, cilTask } from '@coreui/icons'
import { getEstudiantes } from '../../services/estudiantesService'
import { getPreinscripcionEstudiante } from '../../services/preInscripcionEstudianteRoutes'
import { getControlDePagosParaLosEstudiante } from '../../services/controlPagosParaEstudiantes'
import {
  getCursosEvaluacionProfesor,
  getCursosProfesor,
  getEstudiantesProfesor,
} from '../../services/gestionProfesor/gestionprofesCursos'
import { getMostrarCursosEstudiante } from '../../services/gestionEstudiante/cursosEstudiante'
import { obtenerRol } from '../utils/usuario'

const mockMetricas = {
  administrador: {
    ingresos: 'Bs. 12.450',
  },
  profesor: {
    asistencia: '92%',
  },
  estudiante: {
    promedio: '85/100',
    examenes: '2 próximos',
    cuenta: 'Al día',
  },
}

const Dashboard = () => {
  const rol = obtenerRol()
  const [metricas, setMetricas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let componenteActivo = true

    const cargarMetricas = async () => {
      setCargando(true)

      try {
        let metricasPorRol = []

        if (rol === 'administrador') {
          const [estudiantes, preinscripciones, pagos] = await Promise.all([
            getEstudiantes(),
            getPreinscripcionEstudiante(),
            getControlDePagosParaLosEstudiante(),
          ])

          metricasPorRol = [
            { color: 'primary', title: 'Total Estudiantes', value: estudiantes.data.length },
            {
              color: 'info',
              title: 'Ingresos del Mes',
              value: mockMetricas.administrador.ingresos,
            },
            {
              color: 'warning',
              title: 'Preinscripciones Pendientes',
              value: preinscripciones.data.length,
            },
            { color: 'danger', title: 'Pagos Vencidos', value: pagos.data.length },
          ]
        } else if (rol === 'profesor') {
          const [cursos, estudiantes, evaluaciones] = await Promise.all([
            getCursosProfesor(),
            getEstudiantesProfesor(),
            getCursosEvaluacionProfesor(),
          ])

          metricasPorRol = [
            { color: 'primary', title: 'Mis Cursos Asignados', value: cursos.data.length },
            { color: 'info', title: 'Total Alumnos a Cargo', value: estudiantes.data.length },
            {
              color: 'warning',
              title: 'Evaluaciones Pendientes de Calificar',
              value: evaluaciones.data.length,
            },
            {
              color: 'danger',
              title: 'Promedio de Asistencia',
              value: mockMetricas.profesor.asistencia,
            },
          ]
        } else if (rol === 'estudiante') {
          const cursos = await getMostrarCursosEstudiante()

          metricasPorRol = [
            { color: 'primary', title: 'Mis Cursos', value: cursos.data.length },
            {
              color: 'info',
              title: 'Mi Promedio General',
              value: mockMetricas.estudiante.promedio,
            },
            {
              color: 'warning',
              title: 'Próximos Exámenes',
              value: mockMetricas.estudiante.examenes,
            },
            { color: 'danger', title: 'Estado de Cuenta', value: mockMetricas.estudiante.cuenta },
          ]
        }

        if (componenteActivo) {
          setMetricas(metricasPorRol)
        }
      } catch (error) {
        console.error('Error al cargar métricas académicas', error)
      } finally {
        if (componenteActivo) {
          setCargando(false)
        }
      }
    }

    cargarMetricas()

    return () => {
      componenteActivo = false
    }
  }, [rol])

  if (cargando) {
    return <CSpinner color="primary" />
  }

  return (
    <CRow className="mb-4" xs={{ gutter: 4 }}>
      {metricas.map((metrica, index) => (
        <CCol key={metrica.title} sm={6} xl={4} xxl={3}>
          <CWidgetStatsA
            color={metrica.color}
            value={
              <>
                {metrica.value} <CIcon icon={[cilPeople, cilCash, cilTask, cilBook][index]} />
              </>
            }
            title={metrica.title}
          />
        </CCol>
      ))}
    </CRow>
  )
}

export default Dashboard
