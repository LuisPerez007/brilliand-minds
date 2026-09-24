import { useMostrarCursosProfesor } from './hooks/useMostrarCursosProfesor'
import TableCursoProfesor from './components/TableCursosProfesor'

const MostrarCursoProfesor = () => {
  const { cursosProfesor } = useMostrarCursosProfesor()
  return (
    <div className="cursos-profesor__container">
      <div className="cursos-profesor__header">
        <h1 className="cursos-profesor__title">Mis cursos</h1>
      </div>
      <TableCursoProfesor cursosProfesor={cursosProfesor} />
    </div>
  )
}

export default MostrarCursoProfesor
