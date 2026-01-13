'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';
import { FaTrash, FaPlus,FaUpload, FaSave } from "react-icons/fa";

export default function HomeConfigPage() {
  const [limiteCards, setLimiteCards] = useState(4);
  const [banners, setBanners] = useState<{ id: string, imageUrl: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // 1. Função Utilitária para limpar a URL (remove o +xml e sujeiras)
  const formatUrl = (url: string) => {
    if (!url) return "";
    return url.split(/[+ ]/)[0].trim();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const configSnap = await getDoc(doc(db, 'configuracoes', 'home'));
        if (configSnap.exists()) setLimiteCards(configSnap.data().limiteCards);

        const bannerSnap = await getDocs(collection(db, 'banners'));
        setBanners(bannerSnap.docs.map(d => ({ 
          id: d.id, 
          imageUrl: d.data().imageUrl 
        })));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        // Garantimos que a URL salva seja a limpa
        const cleanUrl = formatUrl(data.url);
        const docRef = await addDoc(collection(db, 'banners'), { 
          imageUrl: cleanUrl, 
          active: true,
          createdAt: new Date()
        });
        setBanners(prev => [...prev, { id: docRef.id, imageUrl: cleanUrl }]);
      }
    } catch (err) {
      alert("Erro ao subir arquivo para a VPS");
    } finally {
      setUploading(false);
    }
  };

  const saveLimit = async () => {
    await setDoc(doc(db, 'configuracoes', 'home'), { limiteCards });
    alert("Limite atualizado!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar onLogout={() => {}} />
      
      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Configurações da Home</h1>
          <p className="text-slate-500">Gerencie o conteúdo exibido na página principal</p>
        </header>

        {/* Seção Limite de Cards */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="font-semibold mb-4 text-red-900 flex items-center gap-2">
            <FaSave /> Quantidade de Cards em Destaque
          </h2>
          <div className="flex gap-4 items-center">
            <input 
              type="number" 
              value={limiteCards} 
              onChange={e => setLimiteCards(Number(e.target.value))} 
              className="border border-slate-300 p-2 rounded-lg w-24 focus:ring-2 focus:ring-red-500 outline-none" 
            />
            <button 
              onClick={saveLimit} 
              className="bg-red-900 hover:bg-red-800 text-white px-6 py-2 rounded-lg transition-colors shadow-sm"
            >
              Salvar Alteração
            </button>
          </div>
        </section>

        {/* Seção Banners */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-semibold mb-4 text-red-900 flex items-center gap-2">
            <FaPlus /> Gerenciar Banners (1280x490)
          </h2>
          
          <label className={`relative block border-2 border-dashed p-12 text-center cursor-pointer transition-all rounded-xl 
            ${uploading ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'hover:bg-red-50 hover:border-red-300 border-slate-300'}`}>
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <FaUpload />
              </div>
              <span className="font-medium text-slate-700">
                {uploading ? "Processando upload..." : "Arraste ou clique para subir banner"}
              </span>
              <span className="text-xs text-slate-400 font-normal">Formatos aceitos: JPG, PNG, WEBP e SVG</span>
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {banners.map(b => (
              <div key={b.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                <div className="relative aspect-[1280/490] w-full overflow-hidden bg-slate-200">
                  <img 
                    src={formatUrl(b.imageUrl)} 
                    alt="Banner Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                       e.currentTarget.src = "https://placehold.co/1280x490?text=Erro+na+Imagem";
                    }}
                  />
                  {/* Overlay de deletar rápido */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={async () => {
                        if(confirm("Deseja realmente excluir este banner?")) {
                          await deleteDoc(doc(db, 'banners', b.id));
                          setBanners(prev => prev.filter(item => item.id !== b.id));
                        }
                      }} 
                      className="bg-white text-red-600 p-3 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-3 bg-white flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400">ID: {b.id.slice(0, 8)}...</span>
                  <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Ativo" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}