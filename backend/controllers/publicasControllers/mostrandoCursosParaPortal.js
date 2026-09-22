import { obtenerCursosDisponibles } from '../../models/modelsPublicas/cursosDisponibles.js'
import {
  obtenerDeCache,
  guardarEnCache,
  obtenerSolicitudEnCurso,
  guardarSolicitudEnCurso,
  eliminarSolicitudEnCurso
} from '../../utils/cacheImagenesUnsplash.js'

const obtenerImagenUnsplash = async (materia) => {
  const materiaQuery = String(materia || 'education')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  const imagenCacheada = obtenerDeCache(materiaQuery)

  if (imagenCacheada) {
    return imagenCacheada
  }

  const solicitudExistente = obtenerSolicitudEnCurso(materiaQuery)

  if (solicitudExistente) {
    return solicitudExistente
  }

  const solicitud = (async () => {
    try {
      const query = encodeURIComponent(`${materiaQuery} education`)

      const respuesta = await fetch(
        `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
          }
        }
      )

      if (!respuesta.ok) {
        console.error(
          `Unsplash respondió ${respuesta.status} para "${materiaQuery}"`
        )

        return {
          imagen: null,
          autor: null,
          autorUrl: null,
          unsplashUrl: null
        }
      }

      const foto = await respuesta.json()

      const resultado = {
        imagen: foto.urls?.regular || null,
        autor: foto.user?.name || null,
        autorUrl: foto.user?.links?.html
          ? `${foto.user.links.html}?utm_source=Cursos%20Disponibles&utm_medium=referral`
          : null,
        unsplashUrl: foto.links?.html
          ? `${foto.links.html}?utm_source=Cursos%20Disponibles&utm_medium=referral`
          : null,
        downloadLocation: foto.links?.download_location || null
      }

      guardarEnCache(materiaQuery, resultado)

      return resultado
    } catch (error) {
      console.error(
        `Error consultando Unsplash para "${materiaQuery}":`,
        error.message
      )

      return {
        imagen: null,
        autor: null,
        autorUrl: null,
        unsplashUrl: null
      }
    } finally {
      eliminarSolicitudEnCurso(materiaQuery)
    }
  })()

  guardarSolicitudEnCurso(materiaQuery, solicitud)

  return solicitud
}

export const getCursosDisponibles = async (req, res) => {
  try {
    const cursosDisponibles = await obtenerCursosDisponibles()
    const filas = cursosDisponibles.rows || []

    const cursosConImagenes = await Promise.all(
      filas.map(async (curso) => {
        const foto = await obtenerImagenUnsplash(curso.materia)

        return {
          ...curso,
          imagen: foto.imagen,
          autorImagen: foto.autor,
          autorImagenUrl: foto.autorUrl,
          unsplashUrl: foto.unsplashUrl,
          downloadLocation: foto.downloadLocation
        }
      })
    )

    return res.status(200).json(cursosConImagenes)
  } catch (error) {
    console.error('Error al obtener cursos disponibles:', error)

    return res.status(500).json({
      message: 'Error interno servidor'
    })
  }
}
