import { NavLink, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  bagCheckOutline,
  homeOutline,
  logOutOutline,
  personCircleOutline,
  reorderThreeOutline,
  statsChartOutline,
} from "ionicons/icons";
import { useState } from "react";

const Navbar = ({ title, Opcion1, Opcion2, Opcion3 }) => {
  const navigate = useNavigate();
  const cerrar_sesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("usuario")) || null;

  return (
    <nav className="shadow-md h-full flex items-center justify-between px-8 py-4 sticky top-0 bg-white z-50">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          className="w-12 h-12 object-cover rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          alt="logo"
        />
        <h1 className="text-xl font-bold text-gray-800 tracking-wide">
          {title}
        </h1>
      </div>

      {/* Menu lateral */}
      <ul
        className={`fixed left-0 top-[100px] z-40 h-[calc(100vh-100px)] w-56 bg-white shadow-lg rounded-r-xl p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Opciones */}
        <div className="flex flex-col gap-2">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-all ${
                isActive ? "bg-blue-500 text-white shadow" : ""
              }`
            }
            to="home"
          >
            <IonIcon icon={homeOutline} className="text-xl" />
            <span className="text-sm">Inicio</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-all ${
                isActive ? "bg-blue-500 text-white shadow" : ""
              }`
            }
            to="products"
          >
            <IonIcon icon={bagCheckOutline} className="text-xl" />
            <span className="text-sm">Productos</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition-all ${
                isActive ? "bg-blue-500 text-white shadow" : ""
              }`
            }
            to="motion"
          >
            <IonIcon icon={statsChartOutline} className="text-xl" />
            <span className="text-sm">Estadísticas</span>
          </NavLink>
        </div>

        {/* Logout */}
        <li
          onClick={cerrar_sesion}
          className="cursor-pointer flex items-center gap-3 p-2 rounded-md font-medium text-red-600 hover:bg-red-500 hover:text-white transition-all justify-center text-sm"
        >
          <IonIcon icon={logOutOutline} className="text-2xl" />
          <span>Cerrar sesión</span>
        </li>
      </ul>

      {/* Toggle menu */}
      

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <h3 className="font-semibold text-gray-700">
            {user?.nombre} {user?.apellido}
          </h3>
          <p className="text-sm text-gray-500">{user?.rol || "Usuario"}</p>
        </div>
        <IonIcon
          icon={personCircleOutline}
          className="text-5xl text-gray-700 hover:text-amber-300 transition-colors duration-300"
        />
        <IonIcon
        icon={reorderThreeOutline}
        className="text-3xl cursor-pointer"
        onClick={() => setOpen(!open)}
      />
      </div>
    </nav>
  );
};

export default Navbar;
