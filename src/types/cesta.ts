// types/cesta.ts
export interface Cesta {
  id: string;
  title: string;
  price: number;
  description: string; // "descricao" → "description"
  image: string[]; // array de URLs
  category: "Romance" | "Familia & Amigos" | "Datas Especiais"; // ajustado
  bestseller: boolean;
  createdAt: string; // ISO string, não Date

  // Campos adicionais do seu Firestore
  items: string[];
  customizationOptions: {
    category: string;
    options: string[];
    pricePerItem: number;
  }[];
  formatOptions: {
    cesta?: number;
    bandeja?: number;
    maleta?: number;
    caixamimo?: number;
  };
  mediaPersonalizationFee?: number;
  video?: string;
  rating?: number;
  reviewCount?: number;
  nutritionalInfo?: {
    calories: string;
    certification: string;
    origin: string;
  };
}