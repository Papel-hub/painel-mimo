"use client";

import { useState, useEffect } from "react";

export default function ConnectionStatus() {
  // Inicializa com false, navigator só será acessado no useEffect
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Só roda no cliente
    const checkOnline = () => setIsOnline(navigator.onLine);

    // Checa status inicial
    checkOnline();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-1 ${
        isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full block ${
          isOnline ? "bg-green-200" : "bg-red-200"
        }`}
      ></span>
      {isOnline ? "Online" : "Offline"}
    </div>
  );
}
