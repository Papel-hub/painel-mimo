"use client";

import { FaExclamationCircle, FaEnvelope, FaArrowLeft, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export default function AcessoNegado() {
  const adminEmail = "carlosnslogistica@gmail.com";

  return (
    <div className="flex min-h-screen bg-[#FCE1D0] items-center justify-center p-6">
      <main className="w-full max-w-xl">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50 text-center relative overflow-hidden">
          
          {/* Detalhe Decorativo Superior */}
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6">
            <FaExclamationCircle className="text-red-500" size={40} />
          </div>

          <h1 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
            Ops! Acesso Restrito
          </h1>

          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Seu e-mail não foi encontrado na lista de administradores autorizados ou sua conta está temporariamente inativa.
          </p>

          <div className="grid gap-4 mb-8 text-left">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500">
                <FaEnvelope size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Solicitar Acesso</p>
                <p className="text-sm text-slate-500 mb-2">Envie um e-mail para o administrador master:</p>
                <a 
                  href={`mailto:${adminEmail}`}
                  className="text-red-600 font-semibold text-sm hover:underline break-all"
                >
                  {adminEmail}
                </a>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
              <div className="bg-white p-2 rounded-lg shadow-sm text-orange-500">
                <FaExternalLinkAlt size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Verificar Credenciais</p>
                <p className="text-sm text-slate-500">
                  Certifique-se de que está usando o e-mail corporativo correto.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <FaArrowLeft size={16} /> Voltar ao Login
            </Link>
            
            <a
              href={`mailto:${adminEmail}`}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-red-200 text-slate-700 px-8 py-4 rounded-2xl font-bold transition-all"
            >
              Contatar Suporte
            </a>
          </div>

          <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-semibold">
            v1.0.4 - Mimo System
          </p>
        </div>
      </main>
    </div>
  );
}