// components/Cesta/CestaCard.tsx
import { Cesta } from "@/types/cesta";
import { FaEdit, FaTrash } from "react-icons/fa";

interface CestaCardProps {
  cesta: Cesta;
  onEdit: (cesta: Cesta) => void;
  onDelete: (id: string) => void;
}

export default function CestaCard({ cesta, onEdit, onDelete }: CestaCardProps) {
  const mainImageUrl = cesta.image?.[0] || "";

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition">
      {mainImageUrl && (
        <img
          src={mainImageUrl}
          alt={cesta.title}
          className="w-full h-32 object-cover rounded mb-3"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
      <h3 className="font-bold text-slate-800">{cesta.title}</h3>
      <p className="text-lg font-bold text-green-600">R$ {cesta.price.toFixed(2)}</p>
      <p className="text-xs text-slate-500 mt-1">
        {cesta.category} {cesta.bestseller && "🔥 Mais Vendido"}
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(cesta)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center gap-1 text-sm transition"
        >
          <FaEdit size={14} /> Editar
        </button>
        <button
          onClick={() => onDelete(cesta.id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center justify-center gap-1 text-sm transition"
        >
          <FaTrash size={14} /> Excluir
        </button>
      </div>
    </div>
  );
}