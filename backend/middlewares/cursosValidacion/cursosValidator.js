/// nombre, descripcion, duracion, unidad, precio, cupos
import { body } from 'express-validator'

export const validarCurso = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 carácteres').escape(),
  body('descripcion').optional().trim().isLength({ max: 255 }).escape(),
  body('duracion').trim().notEmpty().isInt({ min: 1 }).withMessage('Duración debe ser un número mayor a 0').toInt(),
  body('unidad').trim().notEmpty().isIn(['hours', 'days', 'weeks', 'months']).withMessage('Unidad inválida'),
  body('precio').trim().notEmpty().isFloat({ min: 0 }).withMessage('Precio debe ser un número válido').toFloat(),
  body('cupos').trim().notEmpty().isInt({ min: 1 }).withMessage('Cupo debe ser mayor a 0').toInt(),
  body('fechaCreacion').trim().notEmpty().withMessage('La fecha de creación es obligatoria').isISO8601().withMessage('La fecha de creación debe tener un formato de fecha válido').toDate(),
  body('idProfesor').trim().notEmpty().withMessage('Profesor obligatorio'),
  body('grupo').trim().notEmpty().withMessage('El grupo es obligatorio').isIn(['Grupo 1', 'Grupo 2', 'Grupo 3', 'Grupo 4']).withMessage('Grupo inválido')
]
