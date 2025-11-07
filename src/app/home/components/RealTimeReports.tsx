"use client";

import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBox,
  FaShoppingBasket,
  FaDollarSign,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Componente reutilizável de Card do Dashboard
type DashboardCardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
};

const DashboardCard = ({ title, count, icon }: DashboardCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2">
    <div className="text-red-800 text-4xl">{icon}</div>
    <div>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <span className="text-2xl font-bold text-slate-800">{count}</span>
    </div>
  </div>
);

export default function RealTimeReports() {
  const [counts, setCounts] = useState({
    clientesCount: 0,
    vendasCount: 0,
  });

  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        const [clientesSnap, vendasSnap] = await Promise.all([
          getDocs(collection(db, "clientes")),
          getDocs(collection(db, "vendas")),
        ]);

        setCounts({
          clientesCount: clientesSnap.size,
          vendasCount: vendasSnap.size,
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-slate-500">Carregando relatórios...</p>
      </div>
    );
  }

  return (
      <div className="bg-slate-50 p-10">
      <section className="grid grid-cols-1 justify-center items-center md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Usuários ativos"
          count={counts.clientesCount}
          icon={<FaUsers size={28} />}
        />
        <DashboardCard
          title="Vendas realizadas"
          count={counts.vendasCount}
          icon={<FaDollarSign size={28} />}
        />
      </section>
    </div>
  );
}
