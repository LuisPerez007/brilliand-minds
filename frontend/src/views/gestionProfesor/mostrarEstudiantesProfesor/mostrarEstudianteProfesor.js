import TableEstudianteProfesor from './components/TableEstudianteProfesor'
import { useMostrarEstudianteProfesor } from './hooks/useMostrarEstudianteProfesor'

const MostrarEstudianteProfesor = () => {
  const { estudianteProfesor } = useMostrarEstudianteProfesor()
  return (
    <>
      <h1>Mis estudiantes</h1>
      <TableEstudianteProfesor estudianteProfesor={estudianteProfesor} />
    </>
  )
}

export default MostrarEstudianteProfesor
