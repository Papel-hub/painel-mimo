"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaHome, FaBox, FaDollarSign, FaBell, FaHeart, FaStar, FaShieldAlt, 
  FaSignOutAlt, FaCalendarAlt, FaChartLine, FaEnvelopeOpenText, FaImages, FaSlidersH 
} from "react-icons/fa";
import Image from "next/image";

interface SidebarProps {
  onLogout: () => void;
}

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: <FaChartLine size={18} /> },
  { href: "/home", label: "Home", icon: <FaHome size={18} /> },
  { href: "/pedidos", label: "Pedidos Recebidos", icon: <FaBox size={18} /> },
  { href: "/cartas", label: "Cartas Mimo", icon: <FaEnvelopeOpenText size={18} /> },
  { href: "/precos", label: "Gerenciar Preços", icon: <FaDollarSign size={18} /> },
  { href: "/itens-surpresa", label: "Produtos/Serviços", icon: <FaStar size={18} /> },
  { href: "/espoza-feliz", label: "Esposa Feliz", icon: <FaHeart size={18} /> },
  { href: "/experiencia-mimo", label: "Experiências", icon: <FaStar size={18} /> },
  { href: "/reunioes", label: "Reuniões", icon: <FaCalendarAlt size={18} /> },
  { href: "/notificacoes", label: "Notificações", icon: <FaBell size={18} /> },
  { href: "/administradores", label: "Usuários Admin", icon: <FaShieldAlt size={18} /> },

];

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-red-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      <div className="flex items-center justify-center h-20 border-b border-red-800/50">
        <Link href="/dashboard" className="transition-transform hover:scale-105">
          <Image
            src="/images/logopc.svg"
            alt="Mimo Meu e Seu"
            width={120}
            height={60}
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-[10px] font-bold uppercase text-red-300/60 mb-4 tracking-widest">
          Menu Principal
        </p>
        
        {menuItems.map((item) => {
          // Lógica de active mais precisa para subrotas
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-red-800 text-white shadow-lg shadow-black/20"
                  : "text-red-100 hover:bg-red-800/50 hover:text-white"
              }`}
            >
              <span className={`${isActive ? "text-white" : "text-red-400 group-hover:text-red-200"} transition-colors`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-red-800/50 bg-red-950/40">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-800/30 hover:bg-red-600 border border-red-700/50 hover:border-red-500 rounded-xl transition-all duration-200 text-sm font-semibold group"
        >
          <FaSignOutAlt size={18} className="text-red-400 group-hover:text-white" />
          <span>Sair do Painel</span>
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-[10px] text-red-400/60 font-medium italic">v1.0.4 - Mimo System</p>
        </div>
      </div>

      {/* Estilização customizada para o scrollbar (opcional se usar Tailwind plugins) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(127, 29, 29, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #7f1d1d;
          border-radius: 10px;
        }
      `}</style>
    </aside>
  );
}