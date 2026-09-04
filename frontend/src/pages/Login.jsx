import { useState } from "react";

const Login = () => {
  const[gmail, setGmail] = useState("")
  const[password, setPassword] = useState("")

  const handleLogin = async(e) => {
    e.preventDefault()

    const res = await fetch('http://localhost:5000/login',
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({gmail, password})
    })

    const data = await res.json()
    if(res.ok){
      localStorage.setItem('token', data.token)
      alert('login exitoso')
    }else{
      alert(data.message)
    }
  }

  return(
    <form onSubmit={handleLogin}>
      <input 
        type="email"
        placeholder="correo"
        value={gmail}
        onChange={(e) => setGmail(e.target.value)}
        />
        <input 
        type="password"
        placeholder="contraceña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">iniciar Sesion</button>

    </form>
  )
}

export default Login