import dataBase from '../db/dataBase.js'
import { mostrarCursos } from '../models/modelsCursos/mostrarCurso.js'
import { crearCursos } from '../models/modelsCursos/crearCursos.js'
import { actualizarCurso } from '../models/modelsCursos/actualizarCursos.js'

export const getCursos = async (req, res) => {
  console.log('mostrando cursos')
  try {
    const dataBaseCursos = await mostrarCursos()
    res.json(dataBaseCursos)
  } catch (error) {
    console.error(error, 'error al obtener estudiante')
    res.status(500).json({ error: 'Error del servidor POSTGRES' })
  }
}

export const postCursos = async (req, res) => {
  try {
    const resultado = await crearCursos(req.body)
    res.status(201).json(resultado)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear curso' })
  }
}

export const putCursos = async (req, res) => {
  try {
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
    const { id } = req.params
    const eliminar = await dataBase.query('DELETE FROM curso where id_curso = $1 RETURNING *', [id])
    if (eliminar.rowCount === 0) {
      return res.status(404).json({ message: 'Curso no encontrado' })
    }
    res.status(200).json({ message: 'Curso eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al eliminar curso' })
  }
}
