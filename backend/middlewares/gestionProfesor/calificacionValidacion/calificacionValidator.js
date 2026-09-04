import { body } from 'express-validator'

export const validarCalificacion = [
  body('nota')
    .notEmpty()
    .withMessage('La nota es obligatoria')
    .isFloat({ min: 0, max: 100 })
    .withMessage('La nota debe estar entre 0 y 100'),

  body('observacion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La observación debe ser texto')
    .trim()
    .isLength({ max: 500 })
    .withMessage('La observación no puede superar los 500 caracteres')
    .escape()]
