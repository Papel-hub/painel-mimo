// pages/reunioes.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { FaCalendarAlt, FaTrash, FaEnvelope, FaPhone, FaVideo, FaBox } from "react-icons/fa";

// Tipo Reuniao ajustado conforme seu documento no Firestore
interface Reuniao {
  id: string;
  contato: string; // WhatsApp (ex: "5567992236484")
  criadoEm: any; // Timestamp do Firebase
  data: string; // Data no formato ISO string (ex: "2025-11-07")
  email: string;
  hora: string; // Hora no formato HH:mm (ex: "22:28")
  nomeEmpresa: string;
  plataforma: string; // ex: "zoom"
  produto: string; // ex: "Flores"
  userId: string; // ID do usuário que agendou
}

const COLLECTION_NAME = "reunioes"; // Nome da coleção

export default function ReunioesPage() {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReunioes = async () => {
    setLoading(true);
    try {
      // Ordena por data de criação (mais recente primeiro)
      const q = query(collection(db, COLLECTION_NAME), orderBy("criadoEm", "desc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reuniao[];
      setReunioes(lista);
    } catch (err) {
      console.error("Erro ao carregar reuniões:", err);
      alert("Erro ao carregar reuniões.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReunioes();
  }, []);

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      window.location.href = "/login";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta reunião?")) return;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      loadReunioes(); // Recarrega após exclusão
    } catch (e) {
      console.error("Erro ao excluir reunião:", e);
      alert("Erro ao excluir a reunião.");
    }
  };

  // Formata timestamp do Firebase para data legível
  const formatarTimestamp = (timestamp: any) => {
    if (!timestamp || !timestamp.seconds) return "Data inválida";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formata a data simples (YYYY-MM-DD) para DD/MM/YYYY
  const formatarData = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar onLogout={handleLogout} />
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" /> Reuniões Agendadas
          </h1>
          <ConnectionStatus />
        </header>

        {/* Lista de Reuniões */}
        <section>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Todas as Reuniões</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reunioes.length === 0 ? (
            <p className="text-center text-slate-500 py-4">Nenhuma reunião encontrada.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reunioes.map((reuniao) => (
                <div key={reuniao.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-800 text-lg truncate" title={`Reunião com ${reuniao.nomeEmpresa}`}>
                      {reuniao.nomeEmpresa}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {reuniao.produto}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt size={14} />
                      <strong>Data:</strong> {formatarData(reuniao.data)}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt size={14} />
                      <strong>Hora:</strong> {reuniao.hora}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaVideo size={14} />
                      <strong>Plataforma:</strong> {reuniao.plataforma}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope size={14} />
                      <strong>Email:</strong> {reuniao.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone size={14} />
                      <strong>Contato:</strong> {reuniao.contato}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-auto">
                    <p><strong>Criado em:</strong> {formatarTimestamp(reuniao.criadoEm)}</p>
                  </div>

                  <hr className="my-3 border-slate-200" />

                  <button
                    onClick={() => handleDelete(reuniao.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded flex items-center justify-center gap-2 text-sm transition-colors duration-200"
                    aria-label={`Excluir reunião com ${reuniao.nomeEmpresa}`}
                  >
                    <FaTrash size={14} /> Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}