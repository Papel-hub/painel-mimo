
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import CestaForm from "./CestaForm";
import { Cesta } from "@/types/cesta";

interface CestaModalProps {
  cesta: Cesta;
  onSave: () => void;
  onClose: () => void;
}

export default function CestaModal({ cesta, onSave, onClose }: CestaModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Editar Cesta</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          <CestaForm cesta={cesta} onSave={onSave} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}