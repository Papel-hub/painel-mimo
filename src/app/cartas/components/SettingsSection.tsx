// components/SettingsSection.tsx
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";

export default function SettingsSection({ 
  precos, setPrecos, salvarPrecos, 
  novoTitulo, setNovoTitulo, novaMensagem, setNovaMensagem, 
  adicionarMensagem, mensagens, excluirMensagem 
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Tabela de Preços */}
      <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
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

      {/* Configuração de Mensagens */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><FaPlus /> Frases Sugeridas</h3>
        <div className="space-y-3 mb-6">
          <input value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} placeholder="Título" className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs font-bold" />
          <textarea value={novaMensagem} onChange={e => setNovaMensagem(e.target.value)} placeholder="Mensagem..." rows={3} className="w-full bg-slate-50 border-none rounded-lg p-2 text-sm" />
          <button onClick={adicionarMensagem} className="w-full bg-red-900 text-white py-3 rounded-xl hover:bg-red-800 font-bold transition">Adicionar</button>
        </div>
        <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {mensagens.map((m: any) => (
            <div key={m.id} className="group relative bg-slate-50 p-3 rounded-xl border border-transparent hover:border-slate-200 transition">
              <h4 className="text-[10px] font-black text-slate-400 mb-1">{m.titulo}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed pr-6">{m.texto}</p>
              <button onClick={() => excluirMensagem(m.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"><FaTrash size={12} /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}