'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  updateDoc, addDoc, deleteDoc, getDoc 
} from 'firebase/firestore';
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { FaEnvelopeOpenText, FaHistory } from "react-icons/fa";
import { toast } from "react-hot-toast";

// Novos Componentes (Certifique-se que o caminho está correto)
import SettingsSection from './components/SettingsSection';
import OrderCard from './components/OrderCard';
import OrderModal from './components/OrderModal';

export default function AdminCartasPage() {
  // --- ESTADOS ---
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [precos, setPrecos] = useState<any>({});
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [pedidoDetalhe, setPedidoDetalhe] = useState<any | null>(null);

  // --- CARREGAMENTO DE DADOS (FIREBASE) ---
  useEffect(() => {
    // Escutar Pedidos
    const qPedidos = query(collection(db, "pedidos"), orderBy("criado_em", "desc"));
    const unsubPedidos = onSnapshot(qPedidos, (snap) => {
      setPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    // Escutar Frases Predefinidas
    const qMsg = collection(db, "mensagens_predefinidas");
    const unsubMsg = onSnapshot(qMsg, (snap) => {
      setMensagens(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Buscar Preços uma vez
    const fetchPrecos = async () => {
      const docRef = doc(db, "precos_carta", "precos");
      const res = await getDoc(docRef);
      if (res.exists()) setPrecos(res.data());
    };

    fetchPrecos();
    return () => { unsubPedidos(); unsubMsg(); };
  }, []);

  // --- FUNÇÕES DE LÓGICA (HANDLERS) ---

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
    // Marcar como visto se ainda não foi
    if (pedido.visto === false || !pedido.hasOwnProperty('visto')) {
      await updateDoc(doc(db, "pedidos", pedido.id), { visto: true });
    }
  };

  const excluirPedido = async (id: string) => {
    if (window.confirm("⚠️ Excluir permanentemente?")) {
      try {
        await deleteDoc(doc(db, "pedidos", id));
        toast.success("Pedido removido!");
      } catch (e) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  const salvarPrecos = async () => {
    try {
      await updateDoc(doc(db, "precos_carta", "precos"), precos);
      toast.success("Preços atualizados!");
    } catch (e) {
      toast.error("Erro ao salvar preços.");
    }
  };

  const adicionarMensagem = async () => {
    if (!novaMensagem.trim() || !novoTitulo.trim()) {
      toast.error("Preencha título e texto.");
      return;
    }
    try {
      await addDoc(collection(db, "mensagens_predefinidas"), { 
        titulo: novoTitulo.toUpperCase(), 
        texto: novaMensagem 
      });
      setNovaMensagem('');
      setNovoTitulo('');
      toast.success("Frase adicionada!");
    } catch (e) {
      toast.error("Erro ao salvar frase.");
    }
  };

  const excluirMensagem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "mensagens_predefinidas", id));
      toast.success("Frase removida.");
    } catch (e) {
      toast.error("Erro ao excluir frase.");
    }
  };

  // Contador de novos pedidos para o cabeçalho
  const novosCount = pedidos.filter(p => p.visto === false || !p.hasOwnProperty('visto')).length;

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
            {novosCount > 0 && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md mt-2 inline-block border border-red-100 uppercase">
                {novosCount} {novosCount === 1 ? 'Novo Pedido' : 'Novos Pedidos'}
              </span>
            )}
          </div>
          <ConnectionStatus />
        </header>

        {/* SEÇÃO DE PREÇOS E MENSAGENS */}
        <SettingsSection 
          precos={precos} 
          setPrecos={setPrecos} 
          salvarPrecos={salvarPrecos}
          novoTitulo={novoTitulo} 
          setNovoTitulo={setNovoTitulo}
          novaMensagem={novaMensagem} 
          setNovaMensagem={setNovaMensagem}
          adicionarMensagem={adicionarMensagem} 
          mensagens={mensagens} 
          excluirMensagem={excluirMensagem}
        />

        {/* LISTAGEM DE PEDIDOS */}
        <div className="space-y-4">
          <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest flex items-center gap-2 px-2">
            <FaHistory /> Histórico de Pedidos
          </h3>
          
          {pedidos.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
              Nenhum pedido encontrado.
            </div>
          ) : (
            pedidos.map(p => (
              <OrderCard 
                key={p.id} 
                pedido={p} 
                atualizarStatus={atualizarStatusPedido} 
                abrirDetalhes={abrirDetalhes} 
                excluirPedido={excluirPedido} 
              />
            ))
          )}
        </div>
      </main>

      {/* MODAL DETALHADO */}
      <OrderModal 
        pedido={pedidoDetalhe} 
        onClose={() => setPedidoDetalhe(null)} 
      />
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
}