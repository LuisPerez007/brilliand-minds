import dataBase from '../db/dataBase.js'
import { postUsuario } from '../models/modelsUsuarios/crearUsuario.js'
export const getEstudiantes = async (req, res) => {
  try {
    const dataBaseEstudiantes = await dataBase.query('SELECT * FROM estudiante')
    console.log(dataBaseEstudiantes.rows)
    res.json(dataBaseEstudiantes.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'error del servidor POSTGRES' })
  }
}

// usuario, password, role
export const postEstudiante = async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email } = req.body
    const datos = {
      usuario: email || telefono,
      password: ci,
      role: 'estudiante'
    }
    const idUsuario = await postUsuario(datos)
    console.log(`id usuario: ${idUsuario}`)
    const result = await dataBase.query(
    `INSERT INTO estudiante 
    (nombre, a_paterno, a_materno, ci, direccion, telefono, email, id_usuario)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *`,
    [nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, idUsuario]
    )
    console.log(result.rows, 'llego aqui y debe motrar los datos insertados')
    res.status(201).json({
      message: 'Estudiante creado con éxito',
      Usuario: datos.usuario,
      Contraceña: ci
    })
  } catch (error) {
    console.log(error)
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'registro_duplicado',
        message: 'El documento de identidad o correo ya se encuentra registrado.'
      })
    }

    res.status(500).json({ error: 'error_interno', message: 'Error interno en el servidor' })
  }
}

export const putEstudiante = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email } = req.body

    const actualizarEstudiante = await dataBase.query(`
      UPDATE estudiante 
      SET nombre = $1, a_paterno = $2, a_materno =$3, ci=$4, direccion = $5, telefono = $6, email = $7 
      WHERE id_estudiante = $8  RETURNING *`,
    [nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, id])
    if (actualizarEstudiante.rowCount === 0) {
      return res.status(404).json({ message: 'El estudiante no existe' })
    }
    console.log(actualizarEstudiante.rows[0], 'se deberia actualizar')
    res.json(actualizarEstudiante.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params
    const eliminar = await dataBase.query('DELETE FROM estudiante where id_estudiante = $1 RETURNING *', [id])
    if (eliminar.rowCount === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' })
    }
    res.status(200).json({ message: 'Estudiante eliminado' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar estudiante' })
  }
}
