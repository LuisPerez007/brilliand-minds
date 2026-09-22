import { mostrarInscripcion } from '../models/modelsInscripcion/mostrarInscripcion.js'
import { mostrarInscripcionPorCurso } from '../models/modelsInscripcion/mostrarInscripcionPorCurso.js'
import { mostrarInscripcionesPorProfesor } from '../models/modelsInscripcion/mostrarInscripcionesPorProfesor.js'
import { crearInscripcion } from '../models/modelsInscripcion/crearInscripcion.js'
import { mostrarInscripcionesPorEstudiante } from '../models/modelsInscripcion/mostrarPorIdEstudiante.js'
import { eliminarInscripcionPorId, eliminarTodasInscripcionesDelCurso } from '../models/modelsInscripcion/eliminarInscripcionPorId.js'
import { eliminarInscripcionPorEstudiante } from '../models/modelsInscripcion/eliminarInscripcionPorEstudiante.js'
import dataBase from '../db/dataBase.js'

/// mostrar
export const getInscripciones = async (req, res) => {
  try {
    const result = await mostrarInscripcion()
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No hay registro de inscripciones' })
    }
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al cargar Inscripciones' })
  }
}

/// MOSTRAR POR CURSOS
export const getInscripcionesPorCurso = async (req, res) => {
  try {
    const { id } = req.params
    const result = await mostrarInscripcionPorCurso(id)
    if (!result || result.rowCount === 0) {
      return res.status(200).json({ message: 'No existe inscripciones en este curso' })
    }
    res.status(200).json({ total_estudiantes: result.rowCount, data: result.rows })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al cargar Inscripciones en curso' })
  }
}

/// MOSTRAR POR PROFESORES

export const getInscripcionesPorProfesor = async (req, res) => {
  try {
    const { id } = req.params
    const result = await mostrarInscripcionesPorProfesor(id)
    if (!result || result.rowCount === 0) {
      return res.status(200).json({ message: 'El profesor no tiene cursos asignados o no hay inscripciones registradas', total_estudiantes: 0, datos: [] })
    }
    res.status(200).json({ datos: result.rows })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al cargar inscripciones por profesor' })
  }
}

export const postInscripciones = async (req, res) => {
  const { idEstudiante, idCurso } = req.body
  try {
    const actuales = await dataBase.query(
      'SELECT id_curso FROM inscripcion WHERE id_estudiante = $1'
      , [idEstudiante])
    const cursosActuales = actuales.rows.map(row => row.id_curso)

    const cursosAInsertar = idCurso.filter(id => !cursosActuales.includes(id))
    const cursosAEliminar = cursosActuales.filter(id => !idCurso.includes(id))

    await dataBase.query('BEGIN')
    if (cursosAEliminar.length > 0) {
      await dataBase.query('DELETE FROM inscripcion WHERE id_estudiante = $1 AND id_curso = ANY($2::INT[])', [idEstudiante, cursosAEliminar])
    }

    for (const id of cursosAInsertar) {
      await crearInscripcion(dataBase, { idEstudiante, idCurso: id })
    }

    await dataBase.query('COMMIT')

    res.status(200).json({
      message: 'Inscripciones procesadas correctamente',
      insertados: cursosAInsertar.length,
      eliminados: cursosAEliminar.length,
      totalCursos: idCurso.length
    })
  } catch (error) {
    await dataBase.query('ROLLBACK')
    console.error(error)
    return res.status(500).json({
      error: 'Error interno',
      message: ' No se pudieron actualizar las inscripicones del estudiante'
    })
  }
}

/// hacer inscripcion duplicado
export const mostrarInscripcionPorEstudiante = async (req, res) => {
  try {
    const { id } = req.params
    const result = await mostrarInscripcionesPorEstudiante(id)
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'No existe inscripciones para mostrar' })
    }

    const idsCursos = result.rows.map(inscripcion => inscripcion.id_curso)

    res.status(200).json({ message: `${result.rowCount} Inscripciones mostrando correctamente`, idsCursos })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al mostrar Inscripcion' })
  }
}

export const deleteInscripcionPorId = async (req, res) => {
  try {
    const { id } = req.params
    const result = await eliminarInscripcionPorId(id)
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'No existe inscripción para eliminar' })
    }
    res.status(200).json({ message: 'Eliminado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar inscripcion' })
  }
}

export const deleteinscripcionPorEstudiante = async (req, res) => {
  try {
    const { id } = req.params
    const result = await eliminarInscripcionPorEstudiante(id)

    if (result === 0) {
      return res.status(200).json({ message: 'no hay inscripciones que eliminar' })
    }
    res.status(200).json({ message: `Se eliminaron ${result} inscripciones correctamente` })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error al eliminar inscripciones'
    })
  }
}

export const deleteEliminarTodasInscripcionesDelCurso = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Solo los administradores pueden eliminar inscripciones de un curso.' })
    }
    const { idCurso } = req.params
    const result = await eliminarTodasInscripcionesDelCurso(idCurso)
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'No hay inscripciones que eliminar para este curso' })
    }
    return res.status(200).json({ message: `Se eliminaron ${result.rowCount} inscripciones del curso correctamente` })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al eliminar inscripciones del curso' })
  }
}
