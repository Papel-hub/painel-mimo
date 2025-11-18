// components/Sidebar.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation"; // Para destacar o item ativo

import { 
  FaHome, FaUsers, FaBox, FaDollarSign, FaBell, 
  FaUser, FaFileAlt, FaShieldAlt, FaSignOutAlt,FaCalendarAlt
} from "react-icons/fa";

interface SidebarProps {
  onLogout: () => void;
}

// Defina os itens do menu como dados estruturados
const menuItems = [
  { href: "/home", label: "Inicio", icon: <FaHome size={20} /> },
  { href: "/itens-supresa", label: "Produtos/Serviços", icon: <FaBox size={20} /> },
  { href: "/espoza-feliz", label: "Espoza Feliz", icon: <FaUser size={20} /> },
  { href: "/esperiencia-mimo", label: "Experiencias Mimo", icon: <FaUser size={20} /> },
  { href: "/precos", label: "Preços", icon: <FaDollarSign size={20} /> },
  { href: "/reunioes", label: "Reuniões", icon: <FaCalendarAlt size={20} /> },
  { href: "/notificacoes", label: "Notificações", icon: <FaBell size={20} /> },
  { href: "/administradores", label: "Administradores", icon: <FaShieldAlt size={20} /> },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname(); // Obtém a rota atual

  return (
    <aside className="w-64 bg-red-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-lg z-50">
      {/* Logo */}
      <div className="p-6 border-b border-red-800">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaHome /> Painel Admin
        </h2>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-2 rounded transition ${
              pathname === item.href
                ? "bg-red-700" // Estilo para o item ativo
                : "hover:bg-red-800"
            }`}
            aria-current={pathname === item.href ? "page" : undefined} // Acessibilidade para item ativo
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Botão de Logout */}
      <div className="p-4 border-t border-red-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-2 bg-red-600 hover:bg-red-700 rounded transition"
          aria-label="Sair da conta"
        >
          <FaSignOutAlt size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}