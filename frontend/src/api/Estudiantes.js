import axios from "axios";

const URL = "http://localhost:5000"

export const registrarEstudiante = (data) =>{
   return axios.post(`${URL}/register`, data)
}