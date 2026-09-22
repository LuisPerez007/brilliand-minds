export const getRoleMenuItems = (role) => {
  if (role === 'administrador') {
    return [
      'Dashboard',
      'Registro de Pagos',
      'Padres y Tutores',
      'Estudiantes',
      'Cursos',
      'Profesores',
      'Consultas de inscripciones',
      'Preinscripciones',
      'Control de pagos',
    ]
  }

  if (role === 'profesor') {
    return ['Dashboard', 'Mis cursos', 'Mis estudiantes', 'Evaluaciones']
  }

  return ['Dashboard', 'Inscribirme a cursos', 'Mis cursos y resultados']
}

export const getActionNames = () => [
  'Registrar Estudiante',
  'Registrar Profesor',
  'Registrar Curso',
  'Buscar',
  'Editar',
  'Eliminar',
  'Aprobar',
  'Rechazar',
  'Guardar',
  'Actualizar',
  'Ver pagos',
  'Volver al resumen',
]
