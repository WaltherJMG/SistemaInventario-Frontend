import { NavLink } from "react-router-dom";
import {useNavigate} from 'react-router-dom'
import { useState } from "react";
const Login = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        Login: "",
        Contrasena: ""
    });

    const handlSubmit = async (e) =>{
        e.preventDefault();

        try{
            const res = await fetch("http://localhost:3000/login",  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(login)
            })
            const usuario = await res.json()
            
            if(!res.ok){
                alert(usuario.message || "Las credenciales son incorrectas")
                return;
            }
            alert('Acceso concedido')

            localStorage.setItem('token', usuario.token)
            localStorage.setItem('usuario', JSON.stringify(usuario.usuario))
            
            navigate('/dashboard')
        }catch(error){
            console.log(error);
            alert('Error con el servidor')
        }

    }

    const handleChange = (e) =>{
        setLogin({
            ...login,
            [e.target.name]: 
            e.target.value,
        });
    }
    
    return (
        <div className="flex gap-9 flex-col justify-center items-center bg-gray-50 h-screen ">
            <h1 className="text-3xl font-bold">Login</h1>
            <form onSubmit={handlSubmit} className="max-w-md w-full bg-white p-7 rounded-2xl shadow-xl grid gap-3">
                <div className="grid gap-3">
                    <p className="font-semibold">Email o Cedula</p>
                    <input onChange={handleChange} name="Login" value={login.Login} type="text" placeholder="Email o N.cedula" className="outline-0 p-2 bg-gray-100 border-0 rounded-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                </div>
                <div className="grid gap-3">
                    <p className="font-semibold ">Contraseña</p>
                    <input onChange={handleChange} name="Contrasena" value={login.Contrasena} type="password" placeholder="Contraseña" className="outline-0 p-2 bg-gray-100 border-0 rounded-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                </div>
                <button type="submit" className="p-2 text-white font-semibold mt-2 bg-blue-500 rounded-sm cursor-pointer duration-300 ease-in-out hover:bg-blue-400 ">Inicia Sesión</button>
                <span className="font-semibold mt-2">No tienes una cuenta? <NavLink to='/signin' className="text-blue-500"> Registrarse</NavLink></span>
            </form>
        </div>
    )
}

export default Login;