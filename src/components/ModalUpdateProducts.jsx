import { useState, useEffect } from "react";

const ModalUpdateProducts = ({ isOpen, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    ID_Producto: "",
    ID_Categoria: "",
    NombreProducto: "",
    Descripcion: "",
    Precio: "",
    Stock: "",
    Estado: "Disponible",
  });

  useEffect(() => {
  if (product) {
    setFormData({
      ID_Producto: product.id_producto || product.ID_Producto || "",
      ID_Categoria: product.id_categoria || product.ID_Categoria || "",
      NombreProducto: product.nombreproducto || product.NombreProducto || "",
      Descripcion: product.descripcion || product.Descripcion || "",
      Precio: product.precio || product.Precio || "",
      Stock: product.stock || product.Stock || "",
      Estado: product.estado || product.Estado || "Disponible",
    });
  }
}, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `http://localhost:3000/products/${formData.ID_Producto}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const updated = await res.json();

    onSave(updated);   
    onClose();
    alert("Producto actualizado correctamente");
  } catch (err) {
    console.log(err);
    alert("Error al actualizar producto");
  }
};


  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Actualizar Producto</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="ID_Producto"
              placeholder="ID Producto"
              value={formData.ID_Producto}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled
            />
            <input
              type="text"
              name="NombreProducto"
              placeholder="Nombre Producto"
              value={formData.NombreProducto}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="Descripcion"
              placeholder="Descripción"
              value={formData.Descripcion}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-2">
            <select
            name="ID_Categoria"
            value={formData.ID_Categoria}
            onChange={handleChange}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            >
            <option value="">Seleccione categoría</option>

            {categories.map((c) => (
                <option
                key={c.ID_Categoria || c.id_categoria}
                value={c.ID_Categoria || c.id_categoria}
                >
                {c.NombreCategoria || c.nombrecategoria}
                </option>
            ))}
            </select>

            <input
              type="number"
              name="Precio"
              placeholder="Precio"
              step="0.01"
              value={formData.Precio}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="number"
              name="Stock"
              placeholder="Stock"
              value={formData.Stock}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <select
              name="Estado"
              value={formData.Estado}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
          </div>

          {/* Botones full width */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalUpdateProducts;
