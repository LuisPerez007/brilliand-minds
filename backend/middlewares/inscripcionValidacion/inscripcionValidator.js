import { body } from 'express-validator'

export const validarInscripcion = [
  body('idEstudiante')
    .notEmpty().withMessage('El id del estudiante es obligatorio')
    .isInt().withMessage('El id del estudiante debe ser un número'),

  body('idCurso')
    .notEmpty().withMessage('El id del curso es obligatorio')
    .isInt().withMessage('El id del curso debe ser un número')
]
