import { useState, useEffect } from "react";
import { registrarEstudiante } from "../api/Estudiantes";
import "../styles/Containers.css";

const Register = () => {
  const [formData, setFormData] = useState({
    // estudiante
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    ciEstudiante: "",
    edad: "",
    unidadEducativa: "",
    cursoEscolarActual: "",
    grupo: "",
    // padre
    nombreTutor: "",
    apellidoPaternoTutor: "",
    apellidoMaternoTutor: "",
    ciTutor: "",
    celularTutor: "",
    // inscripcion
    fechaInscripcion: "",
    tipoCurso: "",
    curso: "",
    horario: "",
    // pagos
    precioTotal: "",
    pagoCuenta: "",
    saldo: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step === 1) {
      if (
        !formData.nombre ||
        !formData.apellidoPaterno ||
        !formData.apellidoMaterno ||
        !formData.ciEstudiante ||
        !formData.edad ||
        !formData.unidadEducativa ||
        !formData.cursoEscolarActual ||
        !formData.grupo
      ) {
        alert("Complete los datos del estudiante");
        return;
      }
    }
    if (step === 2) {
      if (
        !formData.nombreTutor ||
        !formData.apellidoPaternoTutor ||
        !formData.apellidoMaternoTutor ||
        !formData.ciTutor ||
        !formData.celularTutor
      ) {
        alert("Complete los Datos del Padre");
        return;
      }
    }
    if (step === 3) {
      if (
        !formData.fechaInscripcion ||
        !formData.tipoCurso ||
        !formData.curso ||
        !formData.horario
      ) {
        alert("Complete los datos de la inscripcion");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarEstudiante(formData);
      alert("Estudiante registrado correctamente");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("error del servidor");
      }
    }
  };

  useEffect(() => {
    const total = Number(formData.precioTotal) - Number(formData.pagoCuenta);
    setFormData((f) => ({
      ...f,
      saldo: total,
    }));
  }, [formData.precioTotal, formData.pagoCuenta]);
  return (
    <>
      {step === 1 && (
        <div className="container-cloud">
          <h2>DATOS DEL ESTUDIANTE</h2>
          <input
            name="nombre"
            value={formData.nombre}
            placeholder="Nombre"
            onChange={handleChange}
          />
          <br />
          <input
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            placeholder="ApellidoPaterno"
            onChange={handleChange}
          />
          <br />
          <input
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            placeholder="Apellido Materno"
            onChange={handleChange}
          />
          <br />
          <input
            name="ciEstudiante"
            value={formData.ciEstudiante}
            placeholder="Carnet"
            onChange={handleChange}
          />
          <br />
          <input
            name="edad"
            value={formData.edad}
            type="number"
            placeholder="Edad"
            onChange={handleChange}
          />
          <br />
          <input
            name="unidadEducativa"
            value={formData.unidadEducativa}
            placeholder="Unidad Educativa"
            onChange={handleChange}
          />
          <br />
          <input
            name="cursoEscolarActual"
            value={formData.cursoEscolarActual}
            placeholder="Curso escolar actual"
            onChange={handleChange}
          />
          <br />
          <input
            name="grupo"
            value={formData.grupo}
            placeholder="Grupo"
            onChange={handleChange}
          />
          <button onClick={nextStep}>Siguente</button>
        </div>
      )}
      {step === 2 && (
        <div className="container-cloud">
          <h1>DATOS DEL PADRE</h1>
          <input
            name="nombreTutor"
            value={formData.nombreTutor}
            placeholder="Nombre Tutor"
            onChange={handleChange}
          />
          <br />
          <input
            name="apellidoPaternoTutor"
            value={formData.apellidoPaternoTutor}
            placeholder="Apellido paterno"
            onChange={handleChange}
          />
          <br />
          <input
            name="apellidoMaternoTutor"
            value={formData.apellidoMaternoTutor}
            placeholder="Apellido materno"
            onChange={handleChange}
          />
          <br />
          <input
            name="ciTutor"
            value={formData.ciTutor}
            placeholder="carnet del padre"
            onChange={handleChange}
          />
          <br />
          <input
            name="celularTutor"
            value={formData.celularTutor}
            placeholder="celular"
            onChange={handleChange}
          />
          <button onClick={prevStep}>Atras</button>
          <button onClick={nextStep}>Siguente</button>
        </div>
      )}
      {step === 3 && (
        <div className="container-cloud">
          <h1>INSCRIPCION</h1>
          <input
            name="fechaInscripcion"
            type="date"
            value={formData.fechaInscripcion}
            placeholder="Fecha"
            onChange={handleChange}
          />
          <br />
          <select
            name="tipoCurso"
            value={formData.tipoCurso}
            onChange={handleChange}
          >
            <option value="">Tipo de Curso</option>
            <option value="Intencivo">Intencivo</option>
            <option value="Vacacional">vacacional</option>
            <option value="Regular">Regular</option>
            <option value="Corto">Corto</option>
          </select>
          <br />
          <input
            name="curso"
            value={formData.curso}
            placeholder="Curso"
            onChange={handleChange}
          />
          <br />
          <input
            name="horario"
            value={formData.horario}
            placeholder="Horario"
            onChange={handleChange}
          />
          <button onClick={prevStep}>Atras</button>
          <button onClick={nextStep}>Siguente</button>
        </div>
      )}
      {step === 4 && (
        <div className="container-cloud">
          <h1>PAGOS</h1>
          <input
            name="precioTotal"
            value={formData.precioTotal}
            placeholder="Precio Total"
            onChange={handleChange}
          />
          <br />
          <input
            name="pagoCuenta"
            value={formData.pagoCuenta}
            placeholder="Pago Cuenta"
            onChange={handleChange}
          />
          <br />
          <input
            name="saldo"
            value={formData.saldo}
            placeholder="Saldo"
            onChange={handleChange}
          />
          <button onClick={prevStep}>Atras</button>
          <button onClick={handleSubmit}>Registrar</button>
        </div>
      )}
    </>
  );
};
export default Register;
