import { obtenerPadresTutors, registrarPadreTutor, actualizarPadreTutor } from '../models/modelsPadreTutor/crudPadreTutor.js'
import dataBase from '../db/dataBase.js'

export const getPadresTutors = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const padresTutors = await obtenerPadresTutors()
    return res.status(200).json(padresTutors.rows)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const postPadreTutor = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const nuevoPadreTutor = await registrarPadreTutor(req.body)
    if (nuevoPadreTutor.rowCount === 0) {
      return res.status(400).json({ message: 'No se pudo registrar el padre/tutor.' })
    }
    return res.status(201).json({ message: 'Padre/Tutor registrado exitosamente.' })
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El CI ya se encuentra registrado en la base de datos.' })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const putPadreTutor = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const { id } = req.params
    const resultado = await actualizarPadreTutor(id, req.body)
    if (resultado.rowCount === 0) {
      return res.status(404).json({ message: 'Padre/Tutor no encontrado.' })
    }
    return res.status(200).json({ message: 'Padre/Tutor actualizado exitosamente.' })
  } catch (error) {
    console.error(error)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El CI ya se encuentra registrado en la base de datos.' })
    }
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

export const deletePadreTutor = async (req, res) => {
  const client = await dataBase.connect()

  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({
        message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.'
      })
    }

    const { id } = req.params

    await client.query('BEGIN')

    const resultado = await client.query(
      'SELECT estado FROM padre_tutor WHERE id_tutor = $1 FOR UPDATE',
      [id]
    )

    if (resultado.rowCount === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({
        message: 'Padre/Tutor no encontrado.'
      })
    }

    const estadoActual = resultado.rows[0].estado
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo'

    await client.query(
      'UPDATE padre_tutor SET estado = $1 WHERE id_tutor = $2',
      [nuevoEstado, id]
    )

    await client.query(
      `UPDATE usuarios usu
       SET estado = $1
       FROM estudiante es
       WHERE es.id_tutor = $2
         AND es.id_usuario = usu.id_usuarios`,
      [nuevoEstado, id]
    )

    await client.query('COMMIT')

    return res.status(200).json({
      message: `Padre/Tutor y sus estudiantes actualizados a ${nuevoEstado}.`
    })
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)

    return res.status(500).json({
      message: 'Error interno del servidor.'
    })
  } finally {
    client.release()
  }
}
