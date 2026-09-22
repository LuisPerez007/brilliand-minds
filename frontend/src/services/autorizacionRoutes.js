import api from '../api/api'

export const postLogin = async (data) => await api.post('/login', data)
