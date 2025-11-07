// pages/GerenciarCestas.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { FaBox } from "react-icons/fa";
import { Cesta } from "@/types/cesta";
import CestaList from "./components/CestaList";
import CestaModal from "./components/CestaModal";
import CestaForm from "./components/CestaForm";

const COLLECTION_NAME = "cestas"; // ✅ consistente

export default function GerenciarCestas() {
  const [cestas, setCestas] = useState<Cesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editCesta, setEditCesta] = useState<Cesta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCestas = async () => {
    setLoading(true);
    try {
      // Como createdAt é string, não podemos usar orderBy com serverTimestamp
      // Solução: ordenar no cliente ou converter para Timestamp no futuro
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Cesta[];

      // Ordenar por createdAt (string ISO)
      lista.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setCestas(lista);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar cestas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCestas();
  }, []);

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      window.location.href = "/login";
    }
  };

  const openEditModal = (cesta: Cesta) => {
    setEditCesta(cesta);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditCesta(null);
  };

  const onCestaSaved = () => {
    loadCestas();
    closeModal();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar onLogout={handleLogout} />
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaBox className="text-green-600" /> Gerenciar Cestas
          </h1>
          <ConnectionStatus />
        </header>

        {/* Formulário de criação (fora do modal) */}
        <section className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Adicionar Nova Cesta</h2>
          <CestaForm
            cesta={null}
            onSave={onCestaSaved}
            onCancel={() => {}}
            isSubmitting={false}
          />
        </section>

        <CestaList
          cestas={cestas}
          loading={loading}
          onEdit={openEditModal}
          onDelete={async (id) => {
            if (!confirm("Excluir?")) return;
            try {
              await deleteDoc(doc(db, COLLECTION_NAME, id));
              loadCestas();
            } catch (e) {
              alert("Erro ao excluir.");
            }
          }}
        />

        {isModalOpen && editCesta && (
          <CestaModal
            cesta={editCesta}
            onSave={onCestaSaved}
            onClose={closeModal}
          />
        )}
      </main>
    </div>
  );
}