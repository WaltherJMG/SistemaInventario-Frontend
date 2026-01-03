import React from "react";

const ModalDeleteProducts = ({ isOpen, onClose, product, onDelete }) => {
  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/products/${product.id_producto}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        alert("Error al eliminar producto");
        return;
      }

      onDelete(product.id_producto);
      onClose();
      alert("Producto eliminado correctamente");

    } catch (err) {
      console.log(err);
      alert("Error de conexión al eliminar");
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[420px]">

        <h2 className="text-xl font-semibold text-center text-red-600">
          Confirmar Eliminación
        </h2>

        <p className="mt-4 text-center">
          ¿Seguro que deseas eliminar el producto:
          <span className="font-bold"> {product.nombreproducto}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalDeleteProducts;
