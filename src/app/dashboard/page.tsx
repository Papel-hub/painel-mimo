"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Control from "./components/Control";
import RealTimeReports from "./components/RealTimeReports";
import ProductPlus from "./components/ProductPlus";
import ApprovalCard from "./components/ApprovalCard";
import {
  FaFireAlt,
  FaChartLine,
  FaClipboardCheck,
  FaHome,
} from "react-icons/fa";

// Tipagem para aprovações
interface Approval {
  id: string;
  customerName: string;
  productName: string;
  amount: string;
  categoria: string;
  date: string;
  imageUrl?: string;
  status?: "pendente" | "aprovado" | "reprovado";
}

// Tipagem para os cards do dashboard
type DashboardCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  bgColor: string;
};

// Card pequeno do topo do dashboard
const DashboardCard = ({ title, count, icon, bgColor }: DashboardCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex items-center gap-4">
    <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <span className="text-2xl font-bold text-slate-800">{count}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [counts, setCounts] = useState({
    clientesCount: 0,
    produtosCount: 0,
    vendasCount: 0,
    notificacoesCount: 0,
  });

  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);

  // Obter usuário logado
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "Administrador");
      } else {
        window.location.href = "/login";
      }
    });
    return () => unsubscribe();
  }, []);

  // Buscar dados do Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesSnap, produtosSnap, vendasSnap, notificacoesSnap, approvalsSnap] =
          await Promise.all([
            getDocs(collection(db, "clientes")),
            getDocs(collection(db, "produtos")),
            getDocs(collection(db, "vendas")),
            getDocs(collection(db, "notifications")),
            getDocs(collection(db, "approvals")),
          ]);

        setCounts({
          clientesCount: clientesSnap.size,
          produtosCount: produtosSnap.size,
          vendasCount: vendasSnap.size,
          notificacoesCount: notificacoesSnap.size,
        });

        const approvalsList = approvalsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Approval[];

        // Ordenar por data (mais recentes primeiro)
        approvalsList.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setApprovals(approvalsList);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função de logout
  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      const auth = getAuth();
      await signOut(auth);
      window.location.href = "/login";
    }
  };

  // Funções de aprovação/reprovação
  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "approvals", id), { status: "aprovado" });
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "aprovado" } : a))
    );
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, "approvals", id), { status: "reprovado" });
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "reprovado" } : a))
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este pedido?")) {
      await deleteDoc(doc(db, "approvals", id));
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      <main className="ml-64 flex-1 p-8">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaHome className="text-blue-600" />
            Dashboard
          </h1>
          <ConnectionStatus />
        </header>

        {/* Mensagem de boas-vindas */}
        <p className="text-lg text-slate-700 mb-8">
          Bem-vindo, <strong>{userName || "usuário"}</strong>, ao painel administrativo da{" "}
          <strong>Mimo Meu e Seu</strong>.
        </p>

        {/* Seção de controle */}
        <Control />

        {/* Relatórios */}
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <FaChartLine className="text-red-700" />
          Relatórios em tempo real
        </h2>
        <RealTimeReports />

        {/* Produtos mais vendidos */}
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <FaFireAlt className="text-red-700" />
          Produtos Mais Vendidos
        </h2>
        <ProductPlus />

        {/* Aprovações manuais */}
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <FaClipboardCheck className="text-red-700" />
          Aprovações Manuais
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 py-6">Carregando aprovações...</p>
        ) : approvals.length === 0 ? (
          <p className="text-center text-gray-500 py-6">Nenhuma aprovação pendente.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvals.map((a) => (
              <div key={a.id}>
                <ApprovalCard
                  id={a.id}
                  customerName={a.customerName}
                  productName={a.productName}
                  amount={a.amount}
                  categoria={a.categoria}
                  date={a.date}
                  imageUrl={a.imageUrl || "/images/default-product.png"}
                />

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(a.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(a.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Reprovar
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
