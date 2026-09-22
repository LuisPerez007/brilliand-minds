import { useMostrarCursosResultadosExamenEstudiante } from './hooks/useMostrarCursosResultadosExamenEstudiante'
import TableCursosResultadosExamenEstudiante from './components/TableCursosResultadosExamenEstudiante'
const MostrarCursosResultadosExamenEstudiante = () => {
  const {
    cursosEstudiante,
    cargarCalificacionesDeunCursoEstudiante,
    calificacionesDeunCurso,
    setCalificacionesDeunCurso,
    mostrandoCalificaciones,
    setMostrandoCalificaciones,
  } = useMostrarCursosResultadosExamenEstudiante()
  return (
    <>
      <TableCursosResultadosExamenEstudiante
        cursosEstudiante={cursosEstudiante}
        cargarCalificacionesDeunCursoEstudiante={cargarCalificacionesDeunCursoEstudiante}
        calificacionesDeunCurso={calificacionesDeunCurso}
        setCalificacionesDeunCurso={setCalificacionesDeunCurso}
        mostrandoCalificaciones={mostrandoCalificaciones}
        setMostrandoCalificaciones={setMostrandoCalificaciones}
      />
    </>
  )
}

export default MostrarCursosResultadosExamenEstudiante
