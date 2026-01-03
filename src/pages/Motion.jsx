import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ModalAddMovement from "../components/ModalAddMovement";
import { arrowDownCircleOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

const TableMovements = () => {
  const [movements, setMovements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMovements = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/movements");
    const data = await res.json();
    setMovements(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Movimientos", 14, 10);

    autoTable(doc, {
      head: [["Fecha","Producto","Tipo","Cantidad","Observación","Usuario"]],
      body: movements.map((m) => [
        m.fecha?.split("T")[0],
        m.nombreproducto,
        m.tipo,
        m.cantidad,
        m.observacion || "",
        m.usuario,
      ]),
      startY: 20,
    });

    doc.save("movimientos.pdf");
  };

  const exportExcel = () => {
    const data = movements.map((m) => ({
      Fecha: m.fecha?.split("T")[0],
      Producto: m.nombreproducto,
      Tipo: m.tipo,
      Cantidad: m.cantidad,
      Observación: m.observacion,
      Usuario: m.usuario,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([excelBuffer]), "movimientos.xlsx");
  };

  const deleteMovement = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este movimiento?")) return;

    await fetch(`http://localhost:3000/movements/${id}`, {
      method: "DELETE",
    });

    fetchMovements();
  };

  return (
    <div className="w-[85%] mx-auto mt-20">
      <h1 className="text-4xl font-bold text-center mb-6">
        Movimientos de Productos
      </h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 px-5 cursor-pointer py-2 rounded-xl text-white hover:bg-blue-600 transition shadow-lg"
        >
          Registrar Movimiento
        </button>

        <div className="flex gap-3">
          <button
            onClick={exportPDF}
            className=" cursor-pointer flex items-center gap-2 bg-red-500 px-4 py-2 rounded-xl text-white hover:bg-red-600 transition shadow-lg"
          >
            PDF <IonIcon icon={arrowDownCircleOutline} />
          </button>

          <button
            onClick={exportExcel}
            className="cursor-pointer flex items-center gap-2 bg-green-500 px-4 py-2 rounded-xl text-white hover:bg-green-600 transition shadow-lg"
          >
            Excel <IonIcon icon={arrowDownCircleOutline} />
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-300">
        <table className="w-full text-center text-sm">
          <thead className="bg-gray-800 text-white  top-0">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Observación</th>
              <th className="p-3">Usuario</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="p-5 text-gray-500">
                   Cargando movimientos...
                </td>
              </tr>
            )}

            {!loading && movements.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-gray-500">
                   No existen movimientos registrados aún.
                </td>
              </tr>
            )}

            {movements.map((m, i) => (
              <tr
                key={m.id_movimiento}
                className={`transition hover:bg-blue-50 ${
                  i % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                }`}
              >
                <td className="p-2">{m.fecha?.split("T")[0]}</td>
                <td className="p-2 font-semibold">{m.nombreproducto}</td>

                <td className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      m.tipo === "Entrada" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {m.tipo}
                  </span>
                </td>

                <td className="p-2 font-bold">{m.cantidad}</td>
                <td className="p-2 italic">{m.observacion || "Sin detalle"}</td>
                <td className="p-2">{m.usuario}</td>

                <td className="p-2">
                  <button
                    onClick={() => deleteMovement(m.id_movimiento)}
                    className="bg-red-500 text-white cursor-pointer px-3 py-1 rounded hover:bg-red-600 transition shadow-md"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalAddMovement
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchMovements}
      />
    </div>
  );
};

export default TableMovements;
