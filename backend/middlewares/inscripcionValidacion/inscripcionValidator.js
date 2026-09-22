import { body } from 'express-validator'

export const validarInscripcion = [
  body('idEstudiante')
    .notEmpty().withMessage('El id del estudiante es obligatorio')
    .isInt().withMessage('El id del estudiante debe ser un número'),

  body('idCurso')
    .isArray()
    .withMessage('Los cursos deben enviarse como un arreglo'),

  body('idCurso.*')
    .isInt()
    .withMessage('Cada id de curso debe ser un número')
]
