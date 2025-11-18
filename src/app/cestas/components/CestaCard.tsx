// components/Cesta/CestaCard.tsx
import { Cesta } from "@/types/cesta";
import { FaEdit, FaTrash } from "react-icons/fa";

interface CestaCardProps {
  cesta: Cesta;
  onEdit: (cesta: Cesta) => void;
  onDelete: (id: string) => void;
}

export default function CestaCard({ cesta, onEdit, onDelete }: CestaCardProps) {
  const mainImageUrl = cesta.image?.[0];

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a cesta "${cesta.title}"?`)) {
      onDelete(cesta.id);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Imagem */}
      {mainImageUrl ? (
        <img
          src={mainImageUrl}
          alt={cesta.title}
          className="w-full h-40 object-cover rounded mb-3"
          onError={(e) => {
            // Opcional: substituir por uma imagem placeholder se a original falhar
            e.currentTarget.style.display = "none";
            // Por exemplo, adicionar uma div com um ícone ou texto de fallback
          }}
        />
      ) : (
        <div className="w-full h-40 bg-slate-100 rounded mb-3 flex items-center justify-center">
          <span className="text-slate-400 text-sm">Sem imagem</span>
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-grow">
        <h3 className="font-bold text-slate-800 text-lg mb-1 truncate" title={cesta.title}>
          {cesta.title}
        </h3>
        <p className="text-xl font-bold text-green-600 mb-1">R$ {cesta.price.toFixed(2)}</p>
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>{cesta.category}</span>
          {cesta.bestseller && (
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center">
              🔥 Mais Vendido
            </span>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(cesta)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex items-center justify-center gap-1 text-sm transition-colors duration-200"
          aria-label={`Editar a cesta "${cesta.title}"`}
        >
          <FaEdit size={14} /> Editar
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center justify-center gap-1 text-sm transition-colors duration-200"
          aria-label={`Excluir a cesta "${cesta.title}"`}
        >
          <FaTrash size={14} /> Excluir
        </button>
      </div>
    </div>
  );
}