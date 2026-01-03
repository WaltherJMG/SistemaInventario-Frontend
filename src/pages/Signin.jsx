import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Signin = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    ID_Usuario: "",
    Nombre: "",
    Apellido: "",
    Correo_Electronico: "",
    Contrasena: "",
    Contrasena2: "",
    Rol: "",
    Estado: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();

    if (user.Contrasena !== user.Contrasena2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const { Contrasena2, ...userData } = user;

    try {
        const res = await fetch("http://localhost:3000/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        await res.json();
        alert('Usuario registrado en el sistema')
        navigate('/login')
    } catch (error) {
        console.error(error)
    }
  };
  return (
    <div className="flex gap-9 flex-col justify-center items-center bg-gray-50 h-screen">
      <h1 className="text-3xl font-bold">Sign In</h1>
      <form
        onSubmit={handleSubmitBtn}
        className="max-w-xl w-full bg-white p-7 rounded-2xl shadow-xl grid gap-5"
      >
        <div className="flex  gap-9 w-full">
          <div className="w-full">
            <p className="font-semibold">Cédula</p>
            <input
              onChange={handleChange}
              type="text"
              name="ID_Usuario"
              value={user.ID_Usuario}
              placeholder="Cédula"
              className=" outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="w-full">
            <p className="font-semibold">Nombre</p>
            <input
              onChange={handleChange}
              type="text"
              name="Nombre"
              value={user.Nombre}
              placeholder="Nombre"
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <div className="flex gap-9 w-full">
          <div className="w-full">
            <p className="font-semibold">Apellido</p>
            <input
              onChange={handleChange}
              type="text"
              name="Apellido"
              value={user.Apellido}
              placeholder="Apellido"
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="w-full">
            <p className="font-semibold">Correo Eletrónico</p>
            <input
              onChange={handleChange}
              type="email"
              name="Correo_Electronico"
              value={user.Correo_Electronico}
              placeholder="Correo_Electronico"
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <div className="flex gap-9 w-full">
          <div className="w-full">
            <p className="font-semibold">Contraseña</p>
            <input
              onChange={handleChange}
              type="password"
              name="Contrasena"
              value={user.Contrasena}
              placeholder="Contrasena"
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="w-full">
            <p className="font-semibold">Confirmar contraseña</p>
            <input
              onChange={handleChange}
              name="Contrasena2"
              value={user.Contrasena2}
              type="password"
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <div className="flex gap-9 w-full">
          <div className="w-full">
            <p className="font-semibold">Rol</p>
            <input
              onChange={handleChange}
              type="text"
              name="Rol"
              value={user.Rol}
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div className="w-full">
            <p className="font-semibold">Estado</p>
            <input
              onChange={handleChange}
              name="Estado"
              value={user.Estado}
              type="text"
              className="outline-none border-none rounded-sm mt-2 p-2 bg-gray-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>
        <button
          type="submit"
          className="p-2 text-white font-semibold mt-2 bg-blue-500 rounded-sm cursor-pointer duration-300 ease-in-out hover:bg-blue-400">
          Registrase
        </button>
      </form>
    </div>
  );
};

export default Signin;
