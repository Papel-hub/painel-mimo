"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseConfig';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  updateDoc, addDoc, deleteDoc, getDoc 
} from 'firebase/firestore';
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { 
  FaEnvelopeOpenText, FaSave, FaPlus, FaTrash, FaInfoCircle, 
  FaTimes, FaWhatsapp, FaCalendarAlt, FaUser, FaHistory, FaCopy
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function AdminCartasPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [precos, setPrecos] = useState<any>({});
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novoTitulo, setNovoTitulo] = useState(''); // Novo estado para o título
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [pedidoDetalhe, setPedidoDetalhe] = useState<any | null>(null);

  useEffect(() => {
    const qPedidos = query(collection(db, "pedidos"), orderBy("criado_em", "desc"));
    const unsubPedidos = onSnapshot(qPedidos, (snap) => {
      setPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const qMsg = collection(db, "mensagens_predefinidas");
    const unsubMsg = onSnapshot(qMsg, (snap) => {
      setMensagens(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const fetchPrecos = async () => {
      const docRef = doc(db, "precos_carta", "precos");
      const res = await getDoc(docRef);
      if (res.exists()) setPrecos(res.data());
    };

    fetchPrecos();
    return () => { unsubPedidos(); unsubMsg(); };
  }, []);

  const atualizarStatusPedido = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "pedidos", id), { status });
      toast.success("Status atualizado!");
    } catch (e) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const abrirDetalhes = async (pedido: any) => {
    setPedidoDetalhe(pedido);
    if (pedido.visto === false || !pedido.hasOwnProperty('visto')) {
      await updateDoc(doc(db, "pedidos", pedido.id), { visto: true });
    }
  };

  const copiarLinkMimo = (id: string) => {
    const link = `${window.location.origin}/presente/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado para a área de transferência!");
  };

  const salvarPrecos = async () => {
    try {
      await updateDoc(doc(db, "precos_carta", "precos"), precos);
      toast.success("Tabela de preços atualizada!");
    } catch (e) {
      toast.error("Erro ao salvar preços.");
    }
  };

const adicionarMensagem = async () => {
  if (!novaMensagem.trim() || !novoTitulo.trim()) {
    toast.error("Preencha o título e o texto da mensagem.");
    return;
  }

  try {
    await addDoc(collection(db, "mensagens_predefinidas"), { 
      titulo: novoTitulo.toUpperCase(), // Salva em caixa alta como no seu exemplo
      texto: novaMensagem 
    });
    
    setNovaMensagem('');
    setNovoTitulo('');
    toast.success("Mensagem predefinida adicionada!");
  } catch (e) {
    toast.error("Erro ao salvar mensagem.");
  }
};

  const excluirMensagem = async (id: string) => {
    await deleteDoc(doc(db, "mensagens_predefinidas", id));
    toast.success("Frase removida.");
  };


  const novosPedidosCount = pedidos.filter(p => p.visto === false || !p.hasOwnProperty('visto')).length;

const excluirPedido = async (id: string) => {
  if (window.confirm("⚠️ ATENÇÃO: Tem certeza que deseja excluir este pedido permanentemente? Esta ação não pode ser desfeita.")) {
    try {
      await deleteDoc(doc(db, "pedidos", id));
      toast.success("Pedido removido com sucesso!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao excluir o pedido.");
    }
  }
};
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-red-900 rounded-full border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar onLogout={() => {}} />

      <main className="ml-72 flex-1 p-8">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-red-900 rounded-xl shadow-lg shadow-red-900/20 text-white">
                <FaEnvelopeOpenText size={20} />
              </div>
              Cartas da Mimo
            </h1>
            {novosPedidosCount > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full mt-2 inline-block animate-pulse border border-red-100">
                {novosPedidosCount} {novosPedidosCount === 1 ? 'NOVO PEDIDO' : 'NOVOS PEDIDOS'}
              </span>
            )}
          </div>
          <ConnectionStatus />
        </header>

        {/* TABELA DE PREÇOS E FRASES (MANTIDAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <section className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FaSave className="text-red-900" /> Preços Sugeridos
            </h2>
            <div className="space-y-4">
              {Object.keys(precos).map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-[10px] font-black text-slate-400 uppercase mb-1">{key.replace('_', ' ')}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                    <input 
                      type="number"
                      value={precos[key]}
                      onChange={(e) => setPrecos({...precos, [key]: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-red-900 outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              ))}
              <button onClick={salvarPrecos} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition">
                Atualizar Tabela
              </button>
            </div>
          </section>

{/* FRASES PREDEFINIDAS */}
<section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
    <FaPlus /> Configurar Mensagens Sugeridas
  </h3>
  
  <div className="space-y-3 mb-6">
    <input 
      value={novoTitulo} 
      onChange={e => setNovoTitulo(e.target.value)} 
      placeholder="Título (ex: PEDIDO DE PERDÃO)" 
      className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs font-bold" 
    />
    <textarea 
      value={novaMensagem} 
      onChange={e => setNovaMensagem(e.target.value)} 
      placeholder="Texto completo da mensagem..." 
      rows={3}
      className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm" 
    />
    <button 
      onClick={adicionarMensagem} 
      className="w-full bg-red-900 text-white py-3 rounded-xl  rounded-xl hover:bg-red-800 font-bold  transition"
    >
      Adicionar à Lista
    </button>
  </div>

  <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
    {mensagens.map(m => (
      <div key={m.id} className="group relative bg-slate-50 p-3 rounded-xl border border-transparent hover:border-slate-200 transition">
        <h4 className="text-[10px] font-black text-slate-400 mb-1">{m.titulo}</h4>
        <p className="text-[11px] text-slate-600 leading-relaxed pr-6">{m.texto}</p>
        <button 
          onClick={() => excluirMensagem(m.id)} 
          className="absolute top-2 right-2 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
        >
          <FaTrash size={12} />
        </button>
      </div>
    ))}
  </div>
</section>
        </div>

        {/* LISTA DE PEDIDOS */}
        <div className="space-y-4">
          <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest flex items-center gap-2 px-2">
            <FaHistory /> Histórico de Pedidos
          </h3>

          {pedidos.map((p) => {
            const isNovo = p.visto === false || !p.hasOwnProperty('visto');
            return (
              <div key={p.id} className={`bg-white rounded-3xl border transition-all duration-300 ${isNovo ? 'border-red-500 shadow-xl' : 'border-slate-100 shadow-sm'} overflow-hidden`}>
                <div className="flex flex-col md:flex-row items-center">
                  
                  <div className={`w-full md:w-44 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-50 ${isNovo ? 'bg-red-50/30' : 'bg-transparent'}`}>
                    {isNovo && <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full mb-3 animate-bounce">NOVO</span>}
                    <p className="text-[10px] font-mono text-slate-400 mb-2">#{p.pedidoId || p.id.slice(0,6)}</p>
                    <select 
                      value={p.status}
                      onChange={(e) => atualizarStatusPedido(p.id, e.target.value)}
                      className={`text-[10px] font-bold px-4 py-1.5 rounded-full border outline-none cursor-pointer ${
                        p.status === 'pago' ? 'bg-green-600 border-green-600 text-white' : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="entregue">Entregue</option>
                    </select>
                  </div>

                  <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                      <p className="text-sm font-black text-slate-800 mb-1">{p.cliente?.email || 'WhatsApp User'}</p>
                      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                         <span className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tighter">De: {p.conteudo?.de}</span>
                         <span className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded uppercase tracking-tighter">Para: {p.conteudo?.para}</span>
                         <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase flex items-center gap-1 tracking-tighter">
                            <FaCalendarAlt size={10} /> 
                            {p.conteudo?.data_entrega ? `Entrega: ${p.conteudo.data_entrega}` : "Entrega: Imediata"}
                         </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right mr-2">
                            <p className="text-lg font-black text-slate-900">R$ {p.financeiro?.total?.toFixed(2)}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{p.financeiro?.metodo}</p>
                        </div>
                        
<div className="flex flex-col gap-2">
  <button 
      onClick={() => abrirDetalhes(p)}
      className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition ${
          isNovo ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-900 text-white hover:bg-black'
      }`}
  >
      <FaInfoCircle /> Detalhes
  </button>
  
  <div className="flex gap-2">
    <button 
      onClick={() => {
        const link = `https://cartasdamimo.com/presente/${p.id}`;
        navigator.clipboard.writeText(link);
        toast.success("Link da Mimo copiado!");
      }} 
      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-bold hover:bg-slate-200 transition"
      title="Copiar Link"
    >
      <FaCopy /> Link
    </button>

    <button 
      onClick={() => excluirPedido(p.id)} 
      className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-bold hover:bg-red-500 hover:text-white transition border border-red-100"
      title="Excluir Pedido"
    >
      <FaTrash />
    </button>
  </div>
</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- MODAL DE DETALHES --- */}
      {pedidoDetalhe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative">
            
            <div className="bg-red-900 p-8 text-white">
               <button onClick={() => setPedidoDetalhe(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition">
                 <FaTimes size={20} />
               </button>
               <h2 className="text-2xl font-black mb-1">Informações do Pedido</h2>
               <p className="text-red-200 text-[10px] font-mono uppercase tracking-widest">ID: {pedidoDetalhe.id}</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Dados da Entrega</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg text-red-900"><FaUser size={14} /></div>
                        <p className="text-sm font-bold text-slate-700">{pedidoDetalhe.cliente?.whatsapp || 'Não informado'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg text-red-900"><FaCalendarAlt size={14} /></div>
                        <p className="text-sm font-bold text-slate-700">
                          {pedidoDetalhe.conteudo?.data_entrega ? `Agendado: ${pedidoDetalhe.conteudo.data_entrega}` : "Entrega Imediata"}
                        </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mensagem Escrita</h4>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{pedidoDetalhe.conteudo?.texto}"</p>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-red-950 p-6 rounded-3xl text-white shadow-xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-2">Total Pago</p>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-black">R$ {pedidoDetalhe.financeiro?.total?.toFixed(2)}</span>
                        <span className="text-[9px] font-bold bg-red-800 px-2 py-1 rounded-lg uppercase">{pedidoDetalhe.financeiro?.metodo}</span>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mídias</h4>
<div className="grid grid-cols-1 gap-2">
  {pedidoDetalhe.conteudo?.audio_url && (
    <a 
      href={pedidoDetalhe.conteudo.audio_url.startsWith('http') 
        ? pedidoDetalhe.conteudo.audio_url 
        : `https://cartasdamimo.com/uploads/${pedidoDetalhe.conteudo.audio_url.split('/').pop()}`} 
      target="_blank" 
      rel="noreferrer" 
      className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-2xl text-xs font-black hover:bg-blue-100 transition"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">🔊</span>
        <span>OUVIR ÁUDIO</span>
      </div>
      <FaPlus size={10} />
    </a>
  )}

  {pedidoDetalhe.conteudo?.video_url && (
    <a 
      href={pedidoDetalhe.conteudo.video_url.startsWith('http') 
        ? pedidoDetalhe.conteudo.video_url 
        : `https://cartasdamimo.com/uploads/${pedidoDetalhe.conteudo.video_url.split('/').pop()}`} 
      target="_blank" 
      rel="noreferrer" 
      className="flex items-center justify-between p-4 bg-purple-50 text-purple-700 rounded-2xl text-xs font-black hover:bg-purple-100 transition"
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">🎥</span>
        <span>VER VÍDEO</span>
      </div>
      <FaPlus size={10} />
    </a>
  )}
  
  {!pedidoDetalhe.conteudo?.audio_url && !pedidoDetalhe.conteudo?.video_url && (
    <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-2xl border border-dashed">
      Nenhuma mídia anexada a este pedido.
    </p>
  )}
</div>
                 </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <a 
                href={`https://wa.me/${pedidoDetalhe.cliente?.whatsapp?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 transition"
              >
                <FaWhatsapp size={20} /> WHATSAPP
              </a>
              <button 
                onClick={() => setPedidoDetalhe(null)}
                className="px-8 py-4 bg-white text-slate-700 font-black rounded-2xl border border-slate-200"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}