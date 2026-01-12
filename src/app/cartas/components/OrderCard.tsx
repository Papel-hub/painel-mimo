// components/OrderCard.tsx
import { FaCalendarAlt, FaInfoCircle, FaCopy, FaTrash } from "react-icons/fa";

export default function OrderCard({ pedido, atualizarStatus, abrirDetalhes, excluirPedido }: any) {
  const isNovo = pedido.visto === false || !pedido.hasOwnProperty('visto');
  
  return (
    <div className={`bg-white rounded-3xl border transition-all duration-300 ${isNovo ? 'border-red-500 shadow-xl' : 'border-slate-100 shadow-sm'} overflow-hidden`}>
      <div className="flex flex-col md:flex-row items-center">
        {/* Status Side */}
        <div className={`w-full md:w-44 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-50 ${isNovo ? 'bg-red-50/30' : 'bg-transparent'}`}>
          {isNovo && <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full mb-3 animate-bounce">NOVO</span>}
          <p className="text-[10px] font-mono text-slate-400 mb-2">#{pedido.pedidoId || pedido.id.slice(0,6)}</p>
          <select 
            value={pedido.status}
            onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
            className={`text-[10px] font-bold px-4 py-1.5 rounded-full border outline-none cursor-pointer ${
              pedido.status === 'pago' ? 'bg-green-600 border-green-600 text-white' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="entregue">Entregue</option>
          </select>
        </div>

        {/* Info Content */}
        <div className="flex-1 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm font-black text-slate-800 mb-1">{pedido.cliente?.email || 'WhatsApp User'}</p>
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded uppercase">De: {pedido.conteudo?.de}</span>
              <span className="text-[10px] font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded uppercase">Para: {pedido.conteudo?.para}</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase flex items-center gap-1 tracking-tighter">
                <FaCalendarAlt size={10} /> {pedido.conteudo?.data_entrega || "Imediata"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="text-lg font-black text-slate-900">R$ {pedido.financeiro?.total?.toFixed(2)}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">{pedido.financeiro?.metodo}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => abrirDetalhes(pedido)} className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-black text-white ${isNovo ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-black'}`}>
                <FaInfoCircle /> Detalhes
              </button>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(`https://cartasdamimo.com/presente/${pedido.id}`) }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-bold"><FaCopy /> Link</button>
                <button onClick={() => excluirPedido(pedido.id)} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl border border-red-100"><FaTrash /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}