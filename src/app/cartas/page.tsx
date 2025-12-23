'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  updateDoc, addDoc, deleteDoc, getDoc 
} from 'firebase/firestore';
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { FaEnvelopeOpenText, FaSave, FaPlus, FaTrash, FaCheckCircle, FaClock } from "react-icons/fa";

export default function AdminCartasPage() {
  // Estados para Pedidos
  const [pedidos, setPedidos] = useState<any[]>([]);
  
  // Estados para Preços (Coleção: precos_carta, Doc: precos)
  const [precos, setPrecos] = useState<any>({});
  
  // Estados para Mensagens (Coleção: mensagens_predefinidas)
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Escutar Pedidos em Tempo Real
    const qPedidos = query(collection(db, "pedidos"), orderBy("criado_em", "desc"));
    const unsubPedidos = onSnapshot(qPedidos, (snap) => {
      setPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Escutar Mensagens Predefinidas
    const qMsg = collection(db, "mensagens_predefinidas");
    const unsubMsg = onSnapshot(qMsg, (snap) => {
      setMensagens(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Buscar Preços (Documento Único)
    const fetchPrecos = async () => {
      const docRef = doc(db, "precos_carta", "precos");
      const res = await getDoc(docRef);
      if (res.exists()) setPrecos(res.data());
      setLoading(false);
    };

    fetchPrecos();
    return () => { unsubPedidos(); unsubMsg(); };
  }, []);

  // --- AÇÕES ---
  const atualizarStatusPedido = async (id: string, status: string) => {
    await updateDoc(doc(db, "pedidos", id), { status });
  };

  const salvarPrecos = async () => {
    await updateDoc(doc(db, "precos_carta", "precos"), precos);
    alert("Preços atualizados!");
  };

  const adicionarMensagem = async () => {
    if (!novaMensagem) return;
    await addDoc(collection(db, "mensagens_predefinidas"), { texto: novaMensagem });
    setNovaMensagem('');
  };

  const excluirMensagem = async (id: string) => {
    await deleteDoc(doc(db, "mensagens_predefinidas", id));
  };

  const handleLogout = () => { /* Sua lógica de logout */ };

  if (loading) return <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onLogout={handleLogout} />
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-rose-600 rounded-full border-t-transparent" />
          </div>
          </div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onLogout={handleLogout} />

      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaEnvelopeOpenText className="text-red-900" /> Gerenciar Cartas da Mimo
          </h1>
          <ConnectionStatus />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* COLUNA 1: GERENCIAR PREÇOS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-900">
              <FaSave /> Tabela de Preços
            </h2>
            <div className="space-y-3">
              {Object.keys(precos).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs font-bold text-slate-400 uppercase">{key}</label>
                  <input 
                    type="number"
                    value={precos[key]}
                    onChange={(e) => setPrecos({...precos, [key]: Number(e.target.value)})}
                    className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-900 outline-none"
                  />
                </div>
              ))}
              <button 
                onClick={salvarPrecos}
                className="w-full bg-red-900 text-white py-2 rounded-lg font-bold mt-4 hover:bg-red-800 transition"
              >
                Salvar Todos os Preços
              </button>
            </div>
          </div>

          {/* COLUNA 2: MENSAGENS PREDEFINIDAS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-900">
              <FaPlus /> Frases do Coração
            </h2>
            <div className="flex gap-2 mb-4">
              <input 
                placeholder="Nova frase..."
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                className="flex-1 border rounded-lg p-2 text-sm"
              />
              <button onClick={adicionarMensagem} className="bg-red-900 text-white p-2 rounded-lg"><FaPlus /></button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {mensagens.map((m) => (
                <div key={m.id} className="text-xs bg-slate-50 p-2 rounded flex justify-between items-center border border-slate-100">
                  <span className="truncate mr-2">{m.texto}</span>
                  <button onClick={() => excluirMensagem(m.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
                </div>
              ))}
            </div>
          </div>

        </div>
        {/* LISTA DE PEDIDOS UNIFICADA NO PAINEL */}
<div className="space-y-6 top-4 p-6 rounded-2xl shadow-sm border border-slate-200">
  {pedidos.map((p) => (
    <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:border-red-200 transition-colors">
      <div className="flex flex-col md:flex-row">
        
        {/* Lado Esquerdo: Status e ID */}
        <div className={`w-full md:w-48 p-4 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-slate-100 ${p.origem === 'whatsapp' ? 'bg-green-50/30' : 'bg-red-50/30'}`}>
          <span className={`text-[10px] font-black px-2 py-1 rounded-full mb-2 ${p.origem === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-900'}`}>
            {p.origem?.toUpperCase()}
          </span>
          <p className="text-[10px] font-mono text-slate-400 mb-2">#{p.pedidoId}</p>
          <select 
            value={p.status}
            onChange={(e) => atualizarStatusPedido(p.id, e.target.value)}
            className="text-xs font-bold border rounded-lg p-1 bg-white outline-none cursor-pointer"
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="entregue">Entregue</option>
            <option value="finalizado_whatsapp">Finalizado WPP</option>
          </select>
        </div>

        {/* Centro: Detalhes do Conteúdo */}
        <div className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cliente & Entrega</h4>
            <p className="text-sm font-bold text-slate-800">{p.cliente?.email}</p>
            <p className="text-xs text-slate-500">Para: <span className="font-semibold text-slate-700">{p.conteudo?.para}</span></p>
            <p className="text-xs text-slate-500 italic mt-2">"{p.conteudo?.texto}"</p>
          </div>

          <div className="flex flex-col justify-center gap-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mídias e Arquivos</h4>
            <div className="flex gap-2">
              {p.conteudo?.audio_url ? (
                <a href={p.conteudo.audio_url} target="_blank" className="flex items-center gap-1 text-[10px] bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">🔊 Áudio</a>
              ) : <span className="text-[10px] text-slate-300 italic">Sem áudio</span>}
              
              {p.conteudo?.video_url ? (
                <a href={p.conteudo.video_url} target="_blank" className="flex items-center gap-1 text-[10px] bg-slate-100 p-2 rounded-lg hover:bg-slate-200 transition">🎥 Vídeo</a>
              ) : <span className="text-[10px] text-slate-300 italic">Sem vídeo</span>}
            </div>
            <p className="text-[10px] text-red-600 font-bold mt-1">📅 Entrega: {p.conteudo?.data_entrega || 'Imediata'}</p>
          </div>
        </div>

        {/* Lado Direito: Preço e Botão de Contato */}
        <div className="w-full md:w-48 p-5 flex flex-col justify-between items-end bg-slate-50/50">
          <div className="text-right">
            <p className="text-xl font-black text-slate-900">R$ {p.financeiro?.total?.toFixed(2)}</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">{p.financeiro?.metodo}</p>
          </div>
          
          <a 
            href={`https://wa.me/${p.cliente?.whatsapp?.replace(/\D/g, '')}`} 
            target="_blank"
            className="flex items-center gap-2 text-[10px] font-bold bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700 transition w-full justify-center"
          >
            Falar no Whats
          </a>
        </div>

      </div>
    </div>
  ))}
</div>
      </main>
    </div>
  );
}