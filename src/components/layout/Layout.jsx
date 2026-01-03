import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
const Layout = () =>{
    
    return(
        <div>
            <header className="bg-gray-100 fixed inset-0" style={{height:"100px"}}>
                <Navbar 
                title="Sistema de Inventario"
                Opcion1="Inicio"
                Opcion2="Productos"
                Opcion3="Movimientos"
                />
            </header>
            <section className="pt-[100px] px-6">
                <Outlet />
            </section>
        </div>
    )
}

export default Layout;