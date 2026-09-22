export const routeGroups = {
  administrador: [
    '/dashboard',
    '/admin/recibos',
    '/admin/padres-tutores',
    '/admin/estudiantes',
    '/admin/cursos',
    '/admin/profesores',
    '/admin/inscripciones',
    '/admin/preinscripciones',
    '/admin/control-pagos',
  ],
  profesor: ['/dashboard', '/docente/cursos', '/docente/estudiantes', '/docente/evaluaciones'],
  estudiante: ['/dashboard', '/estudiante/preinscripciones', '/estudiante/cursos'],
}

export const roleTitles = {
  administrador: 'Administración',
  profesor: 'Gestión docente',
  estudiante: 'Gestión estudiante',
}
