'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import Sidebar from '@/components/Sidebar';
import { FaHome, FaUpload, FaTrash } from "react-icons/fa";

export default function HomeConfigPage() {
  const [limiteCards, setLimiteCards] = useState(4);
  const [banners, setBanners] = useState<{ id: string, imageUrl: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      const configSnap = await getDoc(doc(db, 'configuracoes', 'home'));
      if (configSnap.exists()) setLimiteCards(configSnap.data().limiteCards);

      const bannerSnap = await getDocs(collection(db, 'banners'));
      setBanners(bannerSnap.docs.map(d => ({ id: d.id, imageUrl: d.data().imageUrl })));
    };
    fetchData();
  }, []);

  // Upload para a VPS
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
        // Salva a URL gerada pela VPS no Firestore
        const docRef = await addDoc(collection(db, 'banners'), { 
          imageUrl: data.url, 
          active: true 
        });
        setBanners(prev => [...prev, { id: docRef.id, imageUrl: data.url }]);
      }
    } catch (err) {
      alert("Erro ao subir arquivo para /var/www/uploads");
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
        <h1 className="text-2xl font-bold mb-8">Gerenciar Home</h1>

        <section className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h2 className="font-semibold mb-4 text-red-900">Quantidade de Cards</h2>
          <div className="flex gap-4">
            <input type="number" value={limiteCards} onChange={e => setLimiteCards(Number(e.target.value))} className="border p-2 rounded w-20" />
            <button onClick={saveLimit} className="bg-red-900 text-white px-4 py-2 rounded">Salvar</button>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-4 text-red-900">Banners (/var/www/up)</h2>
          <label className="block border-2 border-dashed p-10 text-center cursor-pointer hover:bg-slate-50">
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            {uploading ? "Enviando..." : "Clique para subir novo banner"}
          </label>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {banners.map(b => (
              <div key={b.id} className="relative group aspect-video rounded-lg overflow-hidden border">
                <img src={b.imageUrl} className="w-full h-full object-cover" />
                <button onClick={async () => {
                  await deleteDoc(doc(db, 'banners', b.id));
                  setBanners(prev => prev.filter(item => item.id !== b.id));
                }} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}