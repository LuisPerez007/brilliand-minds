import { useEffect, useState } from 'react'
import axios from 'axios'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    axios.get("http://localhost:5000")
    .then(response => setMessage(response.data))
    .catch(error => console.error(error))
  }, [])

  return (
    <>
      <div>
        <h1>BRILLIAND MINDS FRONTEND</h1>
        <p>{message}</p>
      </div>
    </>
  )
}

export default App
