import { body } from 'express-validator'
export const validarEvaluacion = [
  body('nombreEvaluacion').notEmpty().withMessage('El nombre del examen es obligatorio').trim().isLength({ max: 50 }).withMessage('El nombre del examen no puede superar los 50 caracteres').escape(),
  body('descripcion').notEmpty().withMessage('La descripcion es obligatoria').isString().withMessage('La descripcion debe ser texto').trim().isLength({ max: 300 }).withMessage('La observación no puede superar los 300 caracteres').escape(),
  body('fechaEvaluacion').notEmpty().withMessage('Fecha de examen, es obligatoria').isDate().withMessage('La fecha debe ser en formato AAAA-MM-DD').trim().escape(),
  body('porcentaje').trim().notEmpty().withMessage('Porcentaje es obligatorio').isFloat({ min: 0, max: 100 }).withMessage('Porcentaje debe ser numérico').escape()
]
