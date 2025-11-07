// components/Cesta/CestaForm.tsx
import { useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebaseConfig";
import { Cesta } from "@/types/cesta";

interface Props {
  cesta: Cesta | null;
  onSave: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function CestaForm({ cesta, onSave, onCancel, isSubmitting = false }: Props) {
  const [title, setTitle] = useState(cesta?.title || "");
  const [price, setPrice] = useState(String(cesta?.price || ""));
  const [description, setDescription] = useState(cesta?.description || "");
  const [image, setImage] = useState(cesta?.image?.[0] || ""); // simplificado para 1 imagem
  const [category, setCategory] = useState(cesta?.category || "Romance");
  const [bestseller, setBestseller] = useState(cesta?.bestseller || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return alert("Preencha título e preço.");

    const data = {
      title,
      price: parseFloat(price),
      description,
      image: image ? [image.trim()] : [],
      category,
      bestseller,
      createdAt: cesta ? cesta.createdAt : new Date().toISOString(),
      // demais campos podem ser adicionados conforme necessário
    };

    try {
      if (cesta) {
        await updateDoc(doc(db, "cestas", cesta.id), data);
      } else {
        await addDoc(collection(db, "cestas"), { ...data, createdAt: serverTimestamp() });
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <input
        type="text"
        placeholder="URL da Imagem (principal)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as any)}
        className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
      >
        <option value="Romance">Romance</option>
        <option value="Familia & Amigos">Família & Amigos</option>
        <option value="Digital">Digital</option>
      </select>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={(e) => setBestseller(e.target.checked)}
        />
        Mais Vendido
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        {cesta ? <FaSave /> : <FaPlus />} {cesta ? "Salvar" : "Adicionar"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} className="ml-2 text-slate-600">
          Cancelar
        </button>
      )}
    </form>
  );
}