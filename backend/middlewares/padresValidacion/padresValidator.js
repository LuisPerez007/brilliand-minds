import { body } from 'express-validator'
/// nombre, apellidoPaterno, apellidoMaterno, ci, telefono, direccion

export const validarPadreTutor = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .escape(),
  body('apellidoPaterno')
    .trim()
    .notEmpty().withMessage('El apellido paterno es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido paterno debe tener entre 2 y 50 caracteres')
    .escape(),
  body('apellidoMaterno')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('ci')
    .trim()
    .notEmpty().withMessage('El CI es obligatorio')
    .matches(/^[0-9\- ]+$/).withMessage('El CI solo debe contener números, espacios o guiones')
    .isLength({ min: 5, max: 15 }).withMessage('El CI debe tener entre 5 y 15 caracteres'),
  body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .isNumeric().withMessage('El teléfono solo debe contener números')
    .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos'),
  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección es obligatoria')
    .isLength({ min: 5, max: 200 }).withMessage('La dirección debe tener entre 5 y 200 caracteres')
    .escape()
]
