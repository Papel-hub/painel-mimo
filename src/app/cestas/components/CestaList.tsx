// components/Cesta/CestaList.tsx
import { Cesta } from "@/types/cesta";
import CestaCard from "./CestaCard";
import { Loader } from "@/components/Loader"; // assumindo que você moveu o Loader para /components

interface CestaListProps {
  cestas: Cesta[];
  loading: boolean;
  onEdit: (cesta: Cesta) => void;
  onDelete: (id: string) => void;
}

export default function CestaList({ cestas, loading, onEdit, onDelete }: CestaListProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Cestas Cadastradas</h2>
      {loading ? (
        <Loader message="Carregando cestas..." />
      ) : cestas.length === 0 ? (
        <p className="text-center text-slate-500 py-4">Nenhuma cesta cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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