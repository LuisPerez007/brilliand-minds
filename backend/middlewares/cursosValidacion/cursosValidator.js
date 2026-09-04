/// nombre, descripcion, duracion, unidad, precio, cupos
import { body } from 'express-validator'

export const validarCurso = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 carácteres').escape(),
  body('descripcion').optional().trim().isLength({ max: 255 }).escape(),
  body('duracion').trim().notEmpty().isInt({ min: 1 }).withMessage('Duración debe ser un número mayor a 0').toInt(),
  body('unidad').trim().notEmpty().isIn(['hours', 'days', 'weeks', 'months']).withMessage('Unidad inválida'),
  body('precio').trim().notEmpty().isFloat({ min: 0 }).withMessage('Precio debe ser un número válido').toFloat(),
  body('cupos').trim().notEmpty().isInt({ min: 1 }).withMessage('Cupo debe ser mayor a 0').toInt(),
  body('idProfesor').trim().notEmpty().withMessage('Profesor obligatorio')
]
