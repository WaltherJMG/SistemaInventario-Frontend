import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const [productos, setProductos] = useState(0);
  const [movimientos, setMovimientos] = useState(0);
  const [categorias, setCategorias] = useState(0);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    try {
      const resProd = await fetch("http://localhost:3000/products");
      const prodData = await resProd.json();
      setProductos(prodData.length);

      const resMov = await fetch("http://localhost:3000/movements");
      const movData = await resMov.json();
      setMovimientos(movData.length);

      const resCat = await fetch("http://localhost:3000/categories");
      const catData = await resCat.json();
      setCategorias(catData.length);
    } catch (error) {
      console.log("Error cargando dashboard:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSearch = async (value) => {
    setSearch(value);
    if (value.trim() === "") {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const [prodRes, movRes, catRes] = await Promise.all([
        fetch("http://localhost:3000/products"),
        fetch("http://localhost:3000/movements"),
        fetch("http://localhost:3000/categories"),
      ]);

      const products = await prodRes.json();
      const movements = await movRes.json();
      const categories = await catRes.json();

      const term = value.toLowerCase();

      const filteredResults = [
        ...products
          .filter((p) => p.nombreproducto.toLowerCase().includes(term))
          .map((p) => ({ type: "Producto", text: p.nombreproducto })),

        ...movements
          .filter((m) =>
            m.nombreproducto?.toLowerCase().includes(term)
          )
          .map((m) => ({ type: "Movimiento", text: m.nombreproducto })),

        ...categories
          .filter((c) => c.nombrecategoria.toLowerCase().includes(term))
          .map((c) => ({ type: "Categoría", text: c.nombrecategoria })),
      ];

      setResults(filteredResults);
    } catch (err) {
      console.log("Error buscando", err);
    }

    setLoading(false);
  };

  return (
    <div className="w-[90%] mx-auto mt-8">

      {/* TITULO */}
      <h1 className="text-4xl font-extrabold text-center mb-2">
        Bienvenido al Panel General
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Visualiza el estado actual del inventario con una experiencia moderna
      </p>

      <div className="w-full flex justify-center mb-6">
        <div className="w-[70%] relative">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="🔍 Busca productos, movimientos o categorías..."
            className="w-full p-4 rounded-2xl shadow-lg border focus:ring-4 
            ring-blue-400 outline-none transition-all duration-300"
          />

          {/* LOADING */}
          {loading && (
            <p className="absolute right-4 top-3 text-blue-500 animate-pulse">
              Buscando...
            </p>
          )}

          {/* RESULTADOS */}
          {results.length > 0 && (
            <div className="absolute bg-white shadow-2xl rounded-xl mt-2 w-full max-h-60 overflow-y-auto animate-fade-in p-3">
              {results.map((r, i) => (
                <div
                  key={i}
                  className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200 transition grid"
                >
                  <span className="text-sm font-bold text-blue-600">
                    {r.type}
                  </span>
                  <span className="text-gray-700">{r.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {search !== "" && !loading && results.length === 0 && (
            <div className="absolute bg-white shadow-2xl rounded-xl mt-2 w-full p-4 text-center text-red-500 font-bold">
            No se encontraron resultados
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <NavLink to="/dashboard/products">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 
          text-white p-6 rounded-2xl shadow-xl  hover:shadow-2xl 
          transition duration-300 cursor-pointer h-[200px] grid items-center">
            <h2 className="text-xl font-semibold">Productos Registrados</h2>
            <p className="text-6xl font-black">{productos}</p>
            <p >Total de productos activos</p>
          </div>
        </NavLink>

        <NavLink to="/dashboard/motion">
          <div className="bg-gradient-to-r from-green-400 to-green-600 
          text-white p-6 rounded-2xl shadow-xl  hover:shadow-2xl 
          transition duration-300 cursor-pointer h-[200px] grid items-center">
            <h2 className="text-xl font-semibold">Movimientos Registrados</h2>
            <p className="text-6xl font-black">{movimientos}</p>
            <p >Entradas / Salidas</p>
          </div>
        </NavLink>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 
        text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl 
        transition duration-300 cursor-pointer h-[200px] grid items-center">
          <h2 className="text-xl font-semibold">Categorías Disponibles</h2>
          <p className="text-6xl font-black">{categorias}</p>
          <p >Organización del inventario</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
