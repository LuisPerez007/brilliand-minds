import TableEstudianteProfesor from './components/TableEstudianteProfesor'
import { useMostrarEstudianteProfesor } from './hooks/useMostrarEstudianteProfesor'

const MostrarEstudianteProfesor = () => {
  const { estudianteProfesor } = useMostrarEstudianteProfesor()
  return (
    <div className="estudiantes-profesor__container">
      <div className="estudiantes-profesor__header">
        <h1 className="estudiantes-profesor__title">Mis estudiantes</h1>
      </div>
      <TableEstudianteProfesor estudianteProfesor={estudianteProfesor} />
    </div>
  )
}

export default MostrarEstudianteProfesor
