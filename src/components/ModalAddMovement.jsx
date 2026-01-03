import { useEffect, useState } from "react";

const ModalAddMovement = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    tipoMovimiento: "",
    cantidad: "",
    fecha: "",
    observacion: "",
    id_usuario: "",
    id_producto: "",
  });

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3000/users");
    const data = await res.json();
    setUsers(data);
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();
    setProducts(data.rows ?? data);
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchProducts();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    await res.json();
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10 backdrop-blur-md">
      <div className="bg-white p-6 rounded w-[650px] shadow-lg">
        
        <h2 className="text-xl font-bold mb-4 text-center">
          Registrar Movimiento
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <select
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setForm({ ...form, tipoMovimiento: e.target.value })
            }
          >
            <option value="">Seleccione tipo</option>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
          </select>

          <select
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setForm({ ...form, id_producto: e.target.value })
            }
          >
            <option value="">Seleccione producto</option>
            {products.map((p) => (
              <option key={p.id_producto} value={p.id_producto}>
                {p.nombreproducto}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setForm({ ...form, id_usuario: e.target.value })
            }
          >
            <option value="">Seleccione usuario</option>
            {users.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Cantidad"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />

          <textarea
            placeholder="Observación"
            className="border p-2 rounded col-span-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) =>
              setForm({ ...form, observacion: e.target.value })
            }
          />

          {/* Botones */}
          <button
            className="bg-blue-400 text-white py-2 rounded hover:bg-blue-600 transition col-span-2 cursor-pointer"
          >
            Guardar
          </button>
        </form>

        <button
          className="mt-3 w-full py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition cursor-pointer"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ModalAddMovement;
