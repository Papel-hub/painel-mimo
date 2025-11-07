// components/Loader.tsx
export const Loader = ({ message }: { message?: string }) => (
  <div className="flex justify-center items-center py-10">
    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-2 text-slate-600">{message || "Carregando..."}</span>
  </div>
);