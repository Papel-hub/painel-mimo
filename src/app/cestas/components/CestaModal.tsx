// components/Cesta/CestaModal.tsx
import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import CestaForm from "./CestaForm";
import { Cesta } from "@/types/cesta";

interface CestaModalProps {
  cesta: Cesta;
  onSave: () => void;
  onClose: () => void;
}

export default function CestaModal({ cesta, onSave, onClose }: CestaModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    // Focar no botão de fechar ao abrir para melhor navegação por teclado
    closeBtnRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Fechar ao clicar fora da área do conteúdo do modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick} // Chama a função se clicar no fundo
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef} // Referência para identificar o conteúdo do modal
        className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Editar Cesta</h2>
          <button
            ref={closeBtnRef} // Referência para foco inicial
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
            aria-label="Fechar modal"
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