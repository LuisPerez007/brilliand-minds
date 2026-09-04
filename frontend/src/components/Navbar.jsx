import { Link } from "react-router-dom";
import "../styles/Containers.css";
import "../styles/Animations.css";
import "../styles/Letters.css";
const Navbar = () => {
  return (
    <nav className="container-nav">
      <div className="title-text-gradient animate-bounce">
        Centro de Investigaciòn Tecnològico <br />
        "Brilliant Minds"
      </div>
      <div className="space-x-4">
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Registrar</Link>
      </div>
    </nav>
  );
};

export default Navbar;
