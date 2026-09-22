import dataBase from '../db/dataBase.js'
import { postUsuario } from '../models/modelsUsuarios/crearUsuario.js'
export const getEstudiantes = async (req, res) => {
  try {
    const dataBaseEstudiantes = await dataBase.query('SELECT * FROM estudiante ORDER BY fecha_registro DESC')
    console.log(dataBaseEstudiantes.rows)
    res.json(dataBaseEstudiantes.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'error del servidor POSTGRES' })
  }
}

// usuario, password, role
export const postEstudiante = async (req, res) => {
  const client = await dataBase.connect()
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, colegio, ci, direccion, telefono, email, idTutor } = req.body
    const datos = {
      usuario: email || telefono,
      password: ci,
      role: 'estudiante'
    }
    await client.query('BEGIN')

    const usuarioExistente = await client.query(
      'SELECT 1 FROM usuarios WHERE email = $1 LIMIT 1',
      [datos.usuario]
    )
    if (usuarioExistente.rowCount > 0) {
      const tipoUsuario = email ? 'correo electrónico' : 'número de teléfono'
      await client.query('ROLLBACK')
      return res.status(400).json({
        error: 'usuario_duplicado',
        message: `Ya existe un usuario registrado con ese ${tipoUsuario}.`
      })
    }

    const ciExistente = await client.query(
      'SELECT 1 FROM estudiante WHERE ci = $1 LIMIT 1',
      [ci]
    )
    if (ciExistente.rowCount > 0) {
      await client.query('ROLLBACK')
      return res.status(400).json({
        error: 'ci_duplicado',
        message: 'El documento de identidad ya está registrado para otro estudiante.'
      })
    }

    if (email) {
      const emailEstudianteExistente = await client.query(
        'SELECT 1 FROM estudiante WHERE email = $1 LIMIT 1',
        [email]
      )
      if (emailEstudianteExistente.rowCount > 0) {
        await client.query('ROLLBACK')
        return res.status(400).json({
          error: 'email_duplicado',
          message: 'El correo electrónico ya está registrado para otro estudiante.'
        })
      }
    }

    const idUsuario = await postUsuario(datos, client)
    console.log(`id usuario: ${idUsuario}`)
    const result = await client.query(
    `INSERT INTO estudiante 
    (nombre, a_paterno, a_materno, ci, direccion, telefono, email, id_usuario, colegio, id_tutor)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *`,
    [nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, idUsuario, colegio, idTutor]
    )
    await client.query('COMMIT')
    console.log(result.rows, 'llego aqui y debe motrar los datos insertados')
    return res.status(201).json({
      message: 'Estudiante creado con éxito',
      Usuario: datos.usuario,
      Contraceña: ci
    })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    console.log(error)
    if (error.code === '23505') {
      const mensajesDuplicado = {
        usuarios_email_key: 'Ya existe un usuario registrado con ese correo o número de teléfono.',
        estudiante_ci_key: 'El documento de identidad ya está registrado para otro estudiante.',
        estudiante_email_key: 'El correo electrónico ya está registrado para otro estudiante.',
        unique_email: 'El correo electrónico ya está registrado para otro estudiante.'
      }
      return res.status(400).json({
        error: 'registro_duplicado',
        message: mensajesDuplicado[error.constraint] || 'El registro ya existe.'
      })
    }

    res.status(500).json({ error: 'error_interno', message: 'Error interno en el servidor' })
  } finally {
    client.release()
  }
}

export const putEstudiante = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, colegio, idTutor } = req.body

    const actualizarEstudiante = await dataBase.query(`
      UPDATE estudiante 
      SET nombre = $1, a_paterno = $2, a_materno =$3, ci=$4, direccion = $5, telefono = $6, email = $7, colegio = $8, id_tutor = $9
      WHERE id_estudiante = $10  RETURNING *`,
    [nombre, apellidoPaterno, apellidoMaterno, ci, direccion, telefono, email, colegio, idTutor, id])
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
  const client = await dataBase.connect()

  try {
    const { id } = req.params

    await client.query('BEGIN')

    const estudiante = await client.query(
      `SELECT id_usuario
       FROM estudiante
       WHERE id_estudiante = $1`,
      [id]
    )

    if (estudiante.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({
        message: 'Estudiante no encontrado'
      })
    }

    const idUsuario = estudiante.rows[0].id_usuario

    await client.query(
      `DELETE FROM estudiante
       WHERE id_estudiante = $1`,
      [id]
    )

    if (idUsuario) {
      await client.query(
        `DELETE FROM usuarios
         WHERE id_usuarios = $1`,
        [idUsuario]
      )
    }

    await client.query('COMMIT')

    res.status(200).json({
      message: 'Estudiante y usuario eliminado correctamente'
    })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})

    console.error(error)

    res.status(500).json({
      message: 'Error al eliminar estudiante'
    })
  } finally {
    client.release()
  }
}
