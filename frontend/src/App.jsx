import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import "./styles/Containers.css";
import "./styles/Animations.css";
import "./styles/Letters.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((response) => setMessage(response.data))
      .catch((error) => console.error(error));
  }, []);
  //2 3 4titulos 5 6 7
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="container-main">
        <h1 className="title-main">BRILLIAND MINDS FRONTEND</h1>
        <p className="message-violet-animate">
          {message} Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          Exercitationem quas error minus asperiores nulla accusamus nihil
          similique dolore, debitis amet, necessitatibus inventore. Quos ducimus
          cupiditate quisquam dicta ratione iste ab.
        </p>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
