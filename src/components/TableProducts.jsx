import { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  addCircleOutline,
  arrowDownCircleOutline,
  createOutline,
  searchOutline,
  trashOutline,
  refreshOutline
} from "ionicons/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ModalAddProducts from "./ModalAddProduts";
import ModalUpdateProducts from "./ModalUpdateProducts";
import ModalDeleteProducts from "./ModalDeleteProducts";

const TableProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selections, setSelections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    id: "",
    categoria: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    estado: ""
  });

  const [productToEdit, setProductToEdit] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const openDeleteModal = () => {
    if (selections.length !== 1) {
      alert("Selecciona exactamente un producto para eliminar");
      return;
    }
    const selectedProduct = products.find(p => p.id_producto === selections[0]);
    setProductToDelete(selectedProduct);
    setIsDeleteModalOpen(true);
  };

  const handleProductDeleted = () => {
    fetchProducts();
    setSelections([]);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.log(err));
  }, []);

  const openEditModal = () => {
    if (selections.length !== 1) {
      alert("Selecciona exactamente un producto para editar");
      return;
    }

    const selectedProduct = products.find(p => p.id_producto === selections[0]);
    setProductToEdit(selectedProduct);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateProduct = () => {
    fetchProducts();
    setSelections([]);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const selectionFile = (id) => {
    if (selections.includes(id))
      setSelections(selections.filter(i => i !== id));
    else
      setSelections([...selections, id]);
  };

  const filteredProducts = products.filter(
    p =>
      p.id_producto?.toString().includes(filters.id) &&
      (p.nombrecategoria || "").toLowerCase().includes(filters.categoria.toLowerCase()) &&
      (p.nombreproducto || "").toLowerCase().includes(filters.nombre.toLowerCase()) &&
      (p.descripcion || "").toLowerCase().includes(filters.descripcion.toLowerCase()) &&
      p.precio?.toString().includes(filters.precio) &&
      (p.stock?.toString() || "").includes(filters.stock) &&
      (p.estado || "").toLowerCase().includes(filters.estado.toLowerCase())
  );

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    XLSX.writeFile(workbook, "Productos.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Productos", 14, 10);

    autoTable(doc, {
      head: [["ID","Categoría","Nombre","Descripción","Precio","Stock","Estado"]],
      body: products.map(p => [
        p.id_producto,
        p.nombrecategoria || "",
        p.nombreproducto,
        p.descripcion,
        `$${p.precio}`,
        p.stock,
        p.estado
      ]),
      startY: 20,
    });

    doc.save("productos.pdf");
  };

  return (
    <div className="w-[90%] mx-auto mt-20 flex flex-col">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-extrabold">Productos</h1>
          <p className="text-gray-500">Gestión completa del inventario</p>
        </div>

        <button 
          onClick={fetchProducts}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-lg transition">
          Refrescar
          <IonIcon icon={refreshOutline}/>
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-300">
        <table className="w-full text-center text-sm">

          <thead className=" top-0 z-10">
            <tr className="bg-gray-800 text-white">
              <th className="p-3">ID</th>
              <th>Categoría</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Sel.</th>
            </tr>

            {/* FILTROS */}
            <tr className="bg-gray-100">
              {Object.keys(filters).map(key => (
                <th key={key} className="p-1">
                  <input
                    placeholder="Filtrar..."
                    className="w-full p-1 text-sm border rounded-md focus:ring-2 outline-none"
                    onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                  />
                </th>
              ))}
              <th>
                <IonIcon icon={searchOutline} className="text-xl text-gray-700" />
              </th>
            </tr>
          </thead>

          <tbody>

            {/* LOADING */}
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="8" className="h-10 bg-gray-200"></td>
                </tr>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p, i) => (
                <tr
                  key={p.id_producto}
                  className={`transition  hover:bg-blue-50 ${
                    i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                  }`}
                >
                  <td className="p-3 font-bold">{p.id_producto}</td>
                  <td>{p.nombrecategoria}</td>
                  <td className="font-semibold">{p.nombreproducto}</td>
                  <td>{p.descripcion}</td>
                  <td className="text-green-700 font-bold">${p.precio}</td>
                  <td className="font-bold">{p.stock}</td>

                  <td>
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${
                      p.estado === "Disponible"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selections.includes(p.id_producto)}
                      onChange={() => selectionFile(p.id_producto)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-6 text-gray-500">
                   No hay productos que coincidan con la búsqueda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BOTONERA */}
      <div className="flex justify-between mt-6">

        <div className="flex gap-3">
          <button onClick={exportPDF}
            className="bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-red-600 transition flex gap-2 items-center">
            PDF <IonIcon icon={arrowDownCircleOutline}/>
          </button>

          <button onClick={exportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-green-600 transition flex gap-2 items-center">
            Excel <IonIcon icon={arrowDownCircleOutline}/>
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={openModal}
            className="bg-green-400 px-4 py-2 rounded-xl hover:bg-green-500 transition flex gap-2 items-center">
            Agregar <IonIcon icon={addCircleOutline}/>
          </button>

          <button onClick={openEditModal}
            className="bg-amber-400 px-4 py-2 rounded-xl hover:bg-amber-500 transition flex gap-2 items-center">
            Editar <IonIcon icon={createOutline}/>
          </button>

          <button onClick={openDeleteModal}
            className="bg-red-400 px-4 py-2 rounded-xl hover:bg-red-500 transition flex gap-2 items-center">
            Eliminar <IonIcon icon={trashOutline}/>
          </button>
        </div>
      </div>

      {/* MODALES */}
      <ModalAddProducts
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={() => fetchProducts()}
        categories={categories}
      />

      <ModalUpdateProducts
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSave={handleUpdateProduct}
        product={productToEdit}
        categories={categories}
      />

      <ModalDeleteProducts
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={productToDelete}
        onDelete={handleProductDeleted}
      />
    </div>
  );
};

export default TableProducts;
