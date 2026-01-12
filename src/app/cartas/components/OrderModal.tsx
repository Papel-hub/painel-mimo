// components/Admin/OrderModal.tsx
import { FaTimes, FaUser, FaCalendarAlt, FaWhatsapp, FaPlus } from "react-icons/fa";

export default function OrderModal({ pedido, onClose }: any) {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative">
        <div className="bg-red-900 p-8 text-white">
          <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition">
            <FaTimes size={20} />
          </button>
          <h2 className="text-2xl font-black mb-1">Informações do Pedido</h2>
          <p className="text-red-200 text-[10px] font-mono uppercase">ID: {pedido.id}</p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[70vh] overflow-y-auto">
          {/* Coluna Esquerda: Entrega e Mensagem */}
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">Dados da Entrega</h4>
              <div className="space-y-3 text-sm font-bold text-slate-700">
                <p className="flex items-center gap-3"><FaUser className="text-red-900" /> {pedido.cliente?.whatsapp || 'Não informado'}</p>
                <p className="flex items-center gap-3"><FaCalendarAlt className="text-red-900" /> {pedido.conteudo?.data_entrega || "Entrega Imediata"}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">Mensagem Escrita</h4>
              <p className="text-sm text-slate-600 italic leading-relaxed">"{pedido.conteudo?.texto}"</p>
            </div>
          </div>

          {/* Coluna Direita: Financeiro e Midia */}
          <div className="space-y-6">
            <div className="bg-red-950 p-6 rounded-3xl text-white">
              <p className="text-[10px] font-bold text-red-400 mb-2">Total Pago</p>
              <div className="flex justify-between items-end">
                <span className="text-3xl font-black">R$ {pedido.financeiro?.total?.toFixed(2)}</span>
                <span className="text-[9px] font-bold bg-red-800 px-2 py-1 rounded-lg uppercase">{pedido.financeiro?.metodo}</span>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3">Mídias</h4>
              <div className="grid gap-2">
                {pedido.conteudo?.audio_url && <MediaButton url={pedido.conteudo.audio_url} label="OUVIR ÁUDIO" icon="🔊" color="blue" />}
                {pedido.conteudo?.video_url && <MediaButton url={pedido.conteudo.video_url} label="VER VÍDEO" icon="🎥" color="purple" />}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t flex gap-4">
          <a href={`https://wa.me/${pedido.cliente?.whatsapp?.replace(/\D/g, '')}`} target="_blank" className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 transition">
            <FaWhatsapp size={20} /> WHATSAPP
          </a>
          <button onClick={onClose} className="px-8 py-4 bg-white text-slate-700 font-black rounded-2xl border border-slate-200">FECHAR</button>
        </div>
      </div>
    </div>
  );
}

function MediaButton({ url, label, icon, color }: any) {
  const finalUrl = url.startsWith('http') ? url : `https://cartasdamimo.com/uploads/${url.split('/').pop()}`;
  const bgColors: any = { blue: "bg-blue-50 text-blue-700 hover:bg-blue-100", purple: "bg-purple-50 text-purple-700 hover:bg-purple-100" };
  
  return (
    <a href={finalUrl} target="_blank" rel="noreferrer" className={`flex items-center justify-between p-4 rounded-2xl text-xs font-black transition ${bgColors[color]}`}>
      <div className="flex items-center gap-2"><span>{icon}</span><span>{label}</span></div>
      <FaPlus size={10} />
    </a>
  );
}