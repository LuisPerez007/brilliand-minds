import { useMostrarCursosProfesor } from './hooks/useMostrarCursosProfesor'
import TableCursoProfesor from './components/TableCursosProfesor'

const MostrarCursoProfesor = () => {
  const { cursosProfesor } = useMostrarCursosProfesor()
  return (
    <>
      <h1>Mis cursos</h1>
      <TableCursoProfesor cursosProfesor={cursosProfesor} />
    </>
  )
}

export default MostrarCursoProfesor
