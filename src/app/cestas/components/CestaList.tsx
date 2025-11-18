// components/Cesta/CestaList.tsx
import { Cesta } from "@/types/cesta";
import CestaCard from "./CestaCard";
import { Loader } from "@/components/Loader"; // Assumindo que você moveu o Loader para /components

interface CestaListProps {
  cestas: Cesta[];
  loading: boolean;
  onEdit: (cesta: Cesta) => void;
  onDelete: (id: string) => void;
}

export default function CestaList({ cestas, loading, onEdit, onDelete }: CestaListProps) {
  return (
    <section className="w-full">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Cestas Cadastradas</h2>
        <p className="text-sm text-slate-500 mt-1">
          {loading ? "Carregando..." : `Exibindo ${cestas.length} cesta(s).`}
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader message="Carregando cestas..." />
        </div>
      ) : cestas.length === 0 ? (
        <div className="flex justify-center items-center h-40 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-center text-slate-500">
            Nenhuma cesta cadastrada no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cestas.map((cesta) => (
            <CestaCard
              key={cesta.id}
              cesta={cesta}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}