// components/Cesta/CestaForm.tsx
import { useState } from "react";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Cesta } from "@/types/cesta"; // Certifique-se que o caminho está correto

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
  const [images, setImages] = useState<string[]>(cesta?.image || []); // Alterado para array
  const [category, setCategory] = useState<Cesta["category"]>(cesta?.category || "Romance"); // Tipagem correta
  const [bestseller, setBestseller] = useState(cesta?.bestseller || false);
  // Estados para os novos campos
  const [items, setItems] = useState<string[]>(cesta?.items || []);
  const [newItem, setNewItem] = useState("");
  const [customizationOptions, setCustomizationOptions] = useState(
    cesta?.customizationOptions || [{ category: "", options: [""], pricePerItem: 0 }]
  );
  const [formatCesta, setFormatCesta] = useState(String(cesta?.formatOptions?.cesta || ""));
  const [formatBandeja, setFormatBandeja] = useState(String(cesta?.formatOptions?.bandeja || ""));
  const [formatMaleta, setFormatMaleta] = useState(String(cesta?.formatOptions?.maleta || ""));
  const [formatCaixamimo, setFormatCaixamimo] = useState(String(cesta?.formatOptions?.caixamimo || ""));
  const [mediaPersonalizationFee, setMediaPersonalizationFee] = useState(String(cesta?.mediaPersonalizationFee || ""));
  const [video, setVideo] = useState(cesta?.video || "");
  const [rating, setRating] = useState(String(cesta?.rating || ""));
  const [reviewCount, setReviewCount] = useState(String(cesta?.reviewCount || ""));
  const [calories, setCalories] = useState(cesta?.nutritionalInfo?.calories || "");
  const [certification, setCertification] = useState(cesta?.nutritionalInfo?.certification || "");
  const [origin, setOrigin] = useState(cesta?.nutritionalInfo?.origin || "");

  const handleAddImage = () => {
    setImages([...images, ""]);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddCustomizationOption = () => {
    setCustomizationOptions([
      ...customizationOptions,
      { category: "", options: [""], pricePerItem: 0 }
    ]);
  };

  const handleCustomizationChange = (index: number, field: keyof any, value: any) => {
    const newOptions = [...customizationOptions];
    (newOptions[index] as any)[field] = value;
    setCustomizationOptions(newOptions);
  };

  const handleOptionChange = (optionIndex: number, optionArrayIndex: number, value: string) => {
    const newOptions = [...customizationOptions];
    newOptions[optionIndex].options[optionArrayIndex] = value;
    setCustomizationOptions(newOptions);
  };

  const handleAddOption = (optionIndex: number) => {
    const newOptions = [...customizationOptions];
    newOptions[optionIndex].options.push("");
    setCustomizationOptions(newOptions);
  };

  const handleRemoveOption = (optionIndex: number, optionArrayIndex: number) => {
    const newOptions = [...customizationOptions];
    if (newOptions[optionIndex].options.length > 1) {
      newOptions[optionIndex].options.splice(optionArrayIndex, 1);
      setCustomizationOptions(newOptions);
    }
  };

  const handleRemoveCustomizationOption = (index: number) => {
    setCustomizationOptions(customizationOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return alert("Preencha título e preço.");

    const data = {
      title,
      price: parseFloat(price),
      description,
      image: images.filter(img => img.trim() !== ""), // Remove URLs vazias
      category, // Agora está corretamente tipado
      bestseller,
      items,
      customizationOptions: customizationOptions.filter(opt => opt.category.trim() !== ""),
      formatOptions: {
        ...(formatCesta !== "" && { cesta: parseFloat(formatCesta) }),
        ...(formatBandeja !== "" && { bandeja: parseFloat(formatBandeja) }),
        ...(formatMaleta !== "" && { maleta: parseFloat(formatMaleta) }),
        ...(formatCaixamimo !== "" && { caixamimo: parseFloat(formatCaixamimo) }),
      },
      ...(mediaPersonalizationFee !== "" && { mediaPersonalizationFee: parseFloat(mediaPersonalizationFee) }),
      ...(video.trim() !== "" && { video: video.trim() }),
      ...(rating !== "" && { rating: parseInt(rating) }),
      ...(reviewCount !== "" && { reviewCount: parseInt(reviewCount) }),
      nutritionalInfo: {
        ...(calories !== "" && { calories }),
        ...(certification !== "" && { certification }),
        ...(origin !== "" && { origin }),
      },
      createdAt: cesta ? cesta.createdAt : new Date().toISOString(),
    };

    try {
      if (cesta) {
        await updateDoc(doc(db, "cestas", cesta.id), data);
      } else {
        await addDoc(collection(db, "cestas"), { ...data, createdAt: serverTimestamp() });
      }
      onSave();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campos Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preço *</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imagens</label>
        {images.map((img, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder={`URL da Imagem ${index + 1}`}
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImage}
          className="text-blue-500 text-sm"
        >
          + Adicionar Imagem
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          {/* O onChange agora está corretamente tipado */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Cesta["category"])}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="Romance">Romance</option>
            <option value="Familia & Amigos">Família & Amigos</option>
            <option value="Digital">Digital</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bestseller}
              onChange={(e) => setBestseller(e.target.checked)}
            />
            Mais Vendido
          </label>
        </div>
      </div>

      {/* Preços por Formato */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Preços por Formato</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cesta</label>
            <input
              type="number"
              step="0.01"
              value={formatCesta}
              onChange={(e) => setFormatCesta(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Preço"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bandeja</label>
            <input
              type="number"
              step="0.01"
              value={formatBandeja}
              onChange={(e) => setFormatBandeja(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Preço"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Maleta</label>
            <input
              type="number"
              step="0.01"
              value={formatMaleta}
              onChange={(e) => setFormatMaleta(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Preço"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Caixa Mimo</label>
            <input
              type="number"
              step="0.01"
              value={formatCaixamimo}
              onChange={(e) => setFormatCaixamimo(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Preço"
            />
          </div>
        </div>
      </div>

      {/* Itens da Cesta */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Itens da Cesta</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Adicionar item"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Adicionar
          </button>
        </div>
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li key={index} className="flex justify-between">
              {item}
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 text-sm"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Opções de Personalização */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Opções de Personalização</h3>
        {customizationOptions.map((opt, index) => (
          <div key={index} className="mb-4 p-3 border rounded bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                value={opt.category}
                onChange={(e) => handleCustomizationChange(index, 'category', e.target.value)}
                className="p-2 border rounded"
                placeholder="Categoria (ex: Vinhos)"
              />
              <input
                type="number"
                value={opt.pricePerItem}
                onChange={(e) => handleCustomizationChange(index, 'pricePerItem', parseFloat(e.target.value) || 0)}
                className="p-2 border rounded"
                placeholder="Preço por Item"
              />
              <button
                type="button"
                onClick={() => handleRemoveCustomizationOption(index)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Opções</label>
              {opt.options.map((option, optIndex) => (
                <div key={optIndex} className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                    className="flex-1 p-2 border rounded"
                    placeholder={`Opção ${optIndex + 1}`}
                  />
                  {opt.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index, optIndex)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddOption(index)}
                className="text-blue-500 text-sm"
              >
                + Adicionar Opção
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddCustomizationOption}
          className="text-blue-500 text-sm"
        >
          + Adicionar Categoria de Personalização
        </button>
      </div>

      {/* Informações Nutricionais */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Informações Nutricionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Calorias</label>
            <input
              type="text"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex: 200kcal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Certificação</label>
            <input
              type="text"
              value={certification}
              onChange={(e) => setCertification(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex: Orgânico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Origem</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex: Nacional"
            />
          </div>
        </div>
      </div>

      {/* Outros campos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Taxa de Personalização</label>
          <input
            type="number"
            step="0.01"
            value={mediaPersonalizationFee}
            onChange={(e) => setMediaPersonalizationFee(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Taxa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Rating"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Número de Reviews</label>
          <input
            type="number"
            value={reviewCount}
            onChange={(e) => setReviewCount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="# Reviews"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Vídeo (URL)</label>
        <input
          type="text"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="https://youtube.com/..."
        />
      </div>

      {/* Botões de Ação */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {cesta ? <FaSave /> : <FaPlus />} {cesta ? "Salvar" : "Adicionar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="ml-2 text-slate-600 px-4 py-2">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}