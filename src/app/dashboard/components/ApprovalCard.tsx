// components/admin/ApprovalCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface ApprovalCardProps {
  id: string;
  customerName: string;
  productName: string;
  amount: string;
  categoria: string;
  date: string;
  imageUrl?: string; // ✅ deixa opcional
}

export default function ApprovalCard({
  id,
  customerName,
  productName,
  amount,
  categoria,
  date,
  imageUrl,
}: ApprovalCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      {/* Cabeçalho */}
      <div className="flex items-start border-b border-gray-200 pb-3 gap-4">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
          <Image
            src={imageUrl || "/images/default-product.png"}
            alt={productName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base truncate">
            {productName}
          </h3>
          <p className="text-sm text-gray-700">
            Categoria: <span className="font-medium">{categoria}</span>
          </p>
          <p className="text-sm text-gray-700">
            Valor: <span className="font-semibold">{amount}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Enviado em: {date}</p>
          <p className="text-xs font-medium text-gray-800 mt-1">
            Cliente:{" "}
            <span className="text-red-900 font-medium">{customerName}</span>
          </p>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="mt-4 flex justify-between items-center border-b border-gray-200 pb-3">
        <p className="text-sm text-gray-700">Anexos:</p>
        <Link
          href={`/detalhes/${id}`}
          className="flex items-center gap-1 text-sm text-gray-800 hover:text-red-800 font-medium transition-colors"
        >
          Ver detalhes →
        </Link>
      </div>

      {/* Botões */}
      <div className="flex gap-2 mt-5">
        <button
          onClick={() => console.log(`Aprovado: ${id}`)} // ✅ callback placeholder
          className="flex-1 flex items-center justify-center border border-red-900 gap-2 p-3 bg-red-900 text-white font-semibold rounded-full hover:bg-red-800 transition"
          aria-label={`Aprovar pedido ${id}`}
        >
          Aprovar
        </button>
        <button
          onClick={() => console.log(`Reprovado: ${id}`)}
          className="flex-1 flex items-center justify-center border border-red-900 gap-2 p-3 text-red-900 bg-white font-semibold rounded-full hover:bg-red-100 transition"
          aria-label={`Reprovar pedido ${id}`}
        >
          Reprovar
        </button>
      </div>
    </div>
  );
}
