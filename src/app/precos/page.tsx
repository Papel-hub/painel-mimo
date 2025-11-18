// pages/Precos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { FaMoneyBillWave, FaSave } from "react-icons/fa";

// Tipos para os documentos
interface PrecosDoc {
  digital?: number;
  digital_audio?: number;
  digital_fisico_audio?: number;
  digital_video?: number;
  fisico?: number;
  full_premium?: number;
}

export default function PrecosPage() {
  // Estados para cada documento
  const [precos, setPrecos] = useState<PrecosDoc>({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      window.location.href = "/login";
    }
  };

  // Carregar dados do documento 'precos'
  const loadData = async () => {
    try {
      const precosSnap = await getDoc(doc(db, "config", "mensagem"));

      if (precosSnap.exists()) {
        setPrecos(precosSnap.data() as PrecosDoc);
      }
    } catch (err) {
      console.error("Erro ao carregar configurações de preços:", err);
      alert("Erro ao carregar configurações de preços.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage("");
    try {
      await updateDoc(doc(db, "config", "mensagem"), precos as any); // Conversão temporária
      setSuccessMessage("Preços atualizados com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000); // Esconde após 3s
    } catch (err) {
      console.error("Erro ao salvar preços:", err);
      alert("Erro ao salvar preços.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar onLogout={handleLogout} />
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600" /> Configurações de Preços
          </h1>
          <ConnectionStatus />
        </header>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-100 text-green-800 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Seção: Tabela de Preços */}
        <section className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Cartão de mensagem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(precos).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-48 font-medium capitalize">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={value || ""}
                  onChange={(e) =>
                    setPrecos({ ...precos, [key]: parseFloat(e.target.value) || 0 })
                  }
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <FaSave /> {isSaving ? "Salvando..." : "Salvar Preços"}
          </button>
        </div>
      </main>
    </div>
  );
}