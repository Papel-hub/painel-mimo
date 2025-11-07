"use client";

import React from "react";
import { FaUsers, FaBox, FaShoppingBasket, FaHeart, FaBuilding,  FaMapMarkerAlt } from "react-icons/fa";

// Tipagem
type DashboardCardProps = {
  title: string;
  icon: React.ReactNode;
};

const DashboardCard = ({ title, icon }: DashboardCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center gap-2">
    <div className="text-red-800 text-4xl">{icon}</div>
    <h3 className="text-base font-semibold text-slate-700">{title}</h3>
  </div>
);

export default function Control() {



  return (
    <div className=" bg-slate-50 p-10">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Pedidos" icon={<FaBox />} />
        <DashboardCard title="Clientes" icon={<FaUsers />} />
        <a
          href="/cestas"
          >
          <DashboardCard title="Cestas"  icon={<FaShoppingBasket />} />
        </a>
        <a
          href="/pessoaamada"
          >
        <DashboardCard title="Pessoas Amadas" icon={<FaHeart />} />
        </a>
        <a
          href="/parceiros"
          >
        <DashboardCard title="Parceiros" icon={<FaBuilding />} />
        </a>
        <a
          href="/cestas"
          >
        <DashboardCard title="Pontos de Recolha" icon={<FaMapMarkerAlt />} />
        </a>
      </section>
    </div>
  );
}
