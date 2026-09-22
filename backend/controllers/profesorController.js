import dataBase from '../db/dataBase.js'
import { postUsuario } from '../models/modelsUsuarios/crearUsuario.js'

export const getProfesor = async (req, res) => {
  try {
    const dataBaseProfesores = await dataBase.query('SELECT * FROM profesor')
    console.log(dataBaseProfesores.rows)
    res.json(dataBaseProfesores.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error del Servidor POSTGRES' })
  }
}

export const postProfesor = async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, ci, telefono, email, especialidad } = req.body
    const datos = {
      usuario: email || telefono,
      password: ci,
      role: 'profesor'
    }
    const idUsuario = await postUsuario(datos)

    console.log(req.body, 'aqui mostarndo frontend')
    const result = await dataBase.query(
    `INSERT INTO profesor 
    (nombre, a_paterno, a_materno, ci, telefono, email, especialidad, id_usuario) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [nombre, apellidoPaterno, apellidoMaterno, ci, telefono, email, especialidad, idUsuario])
    console.log(result.rows)
    res.status(201).json({
      message: 'Profesor creado con éxito',
      Usuario: datos.usuario,
      Contraceña: ci
    })
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return res.status(400).json({
        error: 'registro_duplicado',
        message: 'El documento de identidad o correo ya se encuentra registrado.'
      })
    }

    res.status(500).json({ error: 'error_interno', message: 'Error interno en el servidor' })
  }
}

export const putProfesor = async (req, res) => {
  try {
    const { id } = req.params
    const idProfesor = parseInt(id)
    const { nombre, apellidoPaterno, apellidoMaterno, ci, telefono, email, especialidad } = req.body
    const actualizarProfesor = await dataBase.query(`
    UPDATE profesor 
    SET  nombre = $1, a_paterno = $2, a_materno = $3, ci = $4, telefono = $5, email = $6, especialidad = $7 
    WHERE id_profesor = $8 RETURNING *`,
    [nombre, apellidoPaterno, apellidoMaterno, ci, telefono, email, especialidad, idProfesor]
    )
    if (actualizarProfesor.rowCount === 0) {
      return res.status(404).json({ message: 'El profesor no existe' })
    }
    console.log(actualizarProfesor.rows[0], 'se deberia actualizar')
    res.status(200).json(actualizarProfesor.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al actualizar profesor' })
  }
}

export const deleteProfesor = async (req, res) => {
  const client = await dataBase.connect()

  try {
    const { id } = req.params
    const idProfesor = parseInt(id)

    await client.query('BEGIN')

    const profesor = await client.query(
      `SELECT id_usuario
       FROM profesor
       WHERE id_profesor = $1`,
      [idProfesor]
    )

    if (profesor.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ message: 'Profesor no existe' })
    }

    const idUsuario = profesor.rows[0].id_usuario

    await client.query(
      `DELETE FROM profesor
       WHERE id_profesor = $1`,
      [idProfesor]
    )

    if (idUsuario) {
      await client.query(
        `DELETE FROM usuarios
         WHERE id_usuarios = $1`,
        [idUsuario]
      )
    }

    await client.query('COMMIT')

    res.status(200).json({ message: 'Profesor y usuario eliminado correctamente' })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar profesor' })
  } finally {
    client.release()
  }
}
