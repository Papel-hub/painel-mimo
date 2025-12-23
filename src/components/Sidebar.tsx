"use client";

import React from "react";
import Link from "next/link"; // Importante para navegação SPA
import { usePathname } from "next/navigation";
import { 
  FaHome, FaBox, FaDollarSign, FaBell, FaHeart, FaStar, FaShieldAlt, 
  FaSignOutAlt, FaCalendarAlt, FaEnvelopeOpenText 
} from "react-icons/fa";

interface SidebarProps {
  onLogout: () => void;
}

// Substitua o menuItems por este:
const menuItems = [
  { href: "", label: "Início", icon: <FaHome size={18} /> },
  { href: "/pedidos", label: "Pedidos Recebidos", icon: <FaBox size={18} /> },
  { href: "/cartas", label: "Cartas Mimo", icon: <FaEnvelopeOpenText size={18} /> },
  { href: "/precos", label: "Gerenciar Preços", icon: <FaDollarSign size={18} /> },
  { href: "/itens-surpresa", label: "Produtos/Serviços", icon: <FaStar size={18} /> },
  { href: "/espoza-feliz", label: "Esposa Feliz", icon: <FaHeart size={18} /> },
  { href: "/experiencia-mimo", label: "Experiências", icon: <FaStar size={18} /> },
  { href: "/reunioes", label: "Reuniões", icon: <FaCalendarAlt size={18} /> },
  { href: "/notificacoes", label: "Notificações", icon: <FaBell size={18} /> },
  { href: "/administradores", label: "Configurações", icon: <FaShieldAlt size={18} /> },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-red-950 text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      {/* Logo / Título */}
      <div className="p-6 border-b border-red-900/50">
        <h2 className="text-xl font-black tracking-tighter flex items-center gap-3">
          <div className="bg-white text-red-950 p-1.5 rounded-lg">
            <FaHeart size={20} />
          </div>
          MIMO
        </h2>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-red-800">
        <p className="px-4 text-[10px] font-bold uppercase text-red-400 mb-2 tracking-widest">Menu Principal</p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                  : "text-red-100 hover:bg-red-900 hover:text-white"
              }`}
            >
              <span className={`${isActive ? "text-white" : "text-red-400 group-hover:text-white"} transition-colors`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé / Logout */}
      <div className="p-4 border-t border-red-900/50 bg-red-950/50">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-transparent hover:bg-red-600 border border-red-800 hover:border-red-600 rounded-xl transition-all duration-200 text-sm font-semibold"
        >
          <FaSignOutAlt size={18} className="text-red-400 group-hover:text-white" />
          <span>Sair do Painel</span>
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-[10px] text-red-500 font-medium italic">v1.0.4 - Mimo System</p>
        </div>
      </div>
    </aside>
  );
}