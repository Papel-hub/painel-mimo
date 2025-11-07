// components/admin/ProductPlus.tsx
"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";


type Produto = {
  id: string;
  nome: string;
  imagemUrl?: string;
  vendidos: number;
};

export default function ProductPlus() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaisVendidos = async () => {
      try {
        const produtosSnap = await getDocs(collection(db, "produtos"));

        // Simulando campo de "vendidos" ou somando das vendas
        const lista: Produto[] = produtosSnap.docs.map((doc) => ({
          id: doc.id,
          nome: doc.data().nome || "Produto sem nome",
          imagemUrl: doc.data().imagemUrl || "/images/p1.png",
          vendidos: doc.data().vendidos || 0,
        }));

        // Ordenar por mais vendidos
        const topVendidos = lista
          .sort((a, b) => b.vendidos - a.vendidos)
          .slice(0, 6);

        setProdutos(topVendidos);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaisVendidos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-slate-500">Carregando produtos mais vendidos...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-10">
      {produtos.length === 0 ? (
        <p className="text-slate-500">Nenhum produto marcado como mais vendido.</p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={produto.imagemUrl ?? "/images/p1.png"}
                  alt={produto.nome ?? "Produto sem nome"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  {produto.nome}
                </h3>
                <p className="text-sm text-slate-500">
                  Vendidos:{" "}
                  <span className="font-bold text-red-700">
                    {produto.vendidos}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
