import { body } from 'express-validator'
/// nombre, apellidoPaterno, apellidoMaterno, ci, telefono, email, especialidad

export const validarProfesor = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').escape(),
  body('apellidoPaterno').trim().notEmpty().withMessage('Apellido es obligatorio').escape(),
  body('apellidoMaterno').optional().trim().escape(),
  body('ci').trim().notEmpty().withMessage('CI es obligatorio').matches(/^[0-9\- ]+$/).withMessage('CI inválido'),
  body('telefono').trim().notEmpty().withMessage('Teléfono es obligatorio').isNumeric().withMessage('El telefono solo debe contener número'),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Debe ser un email válido').normalizeEmail(),
  body('especialidad').trim().notEmpty().withMessage('Especialidad es obligatoria').escape()
]
