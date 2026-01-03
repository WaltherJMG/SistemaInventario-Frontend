import React, { useState } from "react";

const ModalAddProducts = ({ isOpen, onClose, onSave, categories }) => {

    
  const [formData, setFormData] = useState({
    ID_Producto: "",
    ID_Categoria: "",
    NombreProducto: "",
    Descripcion: "",
    Precio: "",
    Stock: "",
    Estado: "Disponible",
  });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      ID_Producto: "",
      ID_Categoria: "",
      NombreProducto: "",
      Descripcion: "",
      Precio: "",
      Stock: "",
      Estado: "Disponible",
    });
    onClose();

     try {
    const res = await fetch("http://localhost:3000/add-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Producto agregado");
      onSave(data.producto); 
      setFormData({
        ID_Producto: "",
        ID_Categoria: "",
        NombreProducto: "",
        Descripcion: "",
        Precio: "",
        Stock: "",
        Estado: "Disponible",
      });
      onClose();
    } else {
      alert("Error: " + data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Error al agregar producto");
  }


  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[600px] shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Agregar Producto</h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input type="number" name="ID_Producto" placeholder="ID Producto" value={formData.ID_Producto} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300" required />
          <select name="ID_Categoria" value={formData.ID_Categoria} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300" required>
            <option value="">Selecciona Categoría</option>
            {categories.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombrecategoria}</option>
            ))}
          </select>
          <input type="text" name="NombreProducto" placeholder="Nombre Producto" value={formData.NombreProducto} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300" required />
          <input type="number" step="0.01" name="Precio" placeholder="Precio" value={formData.Precio} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300" required />
          <textarea name="Descripcion" placeholder="Descripción" value={formData.Descripcion} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300 col-span-2" required />
          <input type="number" name="Stock" placeholder="Stock" value={formData.Stock} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300" required />
          <select name="Estado" value={formData.Estado} onChange={handleChange} className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300">
            <option value="Disponible">Disponible</option>
            <option value="Agotado">Agotado</option>
          </select>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition cursor-pointer">Cancelar</button>
            <button type="submit" className="bg-green-300 px-4 py-2 rounded hover:bg-green-600 transition cursor-pointer">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddProducts;
