import axios from 'axios'
import { getAccessToken, setAccessToken, clearAccessToken } from '../services/authSession'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
})

let refreshEnProceso = false
let colaPendiente = []

const procesarCola = (error, token = null) => {
  colaPendiente.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  colaPendiente = []
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (refreshEnProceso) {
        return new Promise((resolve, reject) => {
          colaPendiente.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((refreshError) => Promise.reject(refreshError))
      }

      originalRequest._retry = true
      refreshEnProceso = true

      try {
        const respuesta = await axios.post(
          'http://localhost:5000/refresh',
          {},
          { withCredentials: true },
        )
        const nuevoToken = respuesta.data.token
        setAccessToken(nuevoToken)
        originalRequest.headers.Authorization = `Bearer ${nuevoToken}`
        procesarCola(null, nuevoToken)
        return api(originalRequest)
      } catch (refreshError) {
        procesarCola(refreshError, null)
        clearAccessToken()
        window.location.hash = '#/login'
        return Promise.reject(refreshError)
      } finally {
        refreshEnProceso = false
      }
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      clearAccessToken()
      window.location.hash = '#/login'
    }

    return Promise.reject(error)
  },
)

export default api
