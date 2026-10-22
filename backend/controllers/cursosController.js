import dataBase from '../db/dataBase.js'
import { mostrarCursos, mostrarCursosPorVencer } from '../models/modelsCursos/mostrarCurso.js'
import { crearCursos } from '../models/modelsCursos/crearCursos.js'
import { actualizarCurso } from '../models/modelsCursos/actualizarCursos.js'

export const getMostrarCursosPorVencer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const cursosPorVencer = await mostrarCursosPorVencer()
    return res.status(200).json({ cursosPorVencer })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error interno servidor' })
  }
}

export const getCursos = async (req, res) => {
  console.log('mostrando cursos')
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const dataBaseCursos = await mostrarCursos()
    res.json(dataBaseCursos)
  } catch (error) {
    console.error(error, 'error al obtener estudiante')
    res.status(500).json({ error: 'Error del servidor POSTGRES' })
  }
}

export const postCursos = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const resultado = await crearCursos(req.body)
    res.status(201).json(resultado)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

export const putCursos = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const { id } = req.params
    const actualizar = await actualizarCurso(id, req.body)

    if (!actualizar) {
      return res.status(404).json({ message: 'El curso no existe' })
    }
    console.log(actualizar, ' se deberia actulizar cursos')
    res.json(actualizar)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error interno del servidor cursos' })
  }
}

export const deleteCurso = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden acceder a esta información.' })
    }
    const { id } = req.params
    const result = await dataBase.query(`
      SELECT estado 
      FROM curso 
      WHERE id_curso = $1
      `, [id])
    if (!result || result.rows.length === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' })
    }

    const estadoActual = result.rows[0].estado
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo'
    await dataBase.query(`
      UPDATE curso 
      SET estado = $1 
      WHERE id_curso = $2
      `,
    [nuevoEstado, id]
    )
    return res.status(200).json({ message: `Curso actualizado a ${nuevoEstado}` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar curso' })
  }
}
