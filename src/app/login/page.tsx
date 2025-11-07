"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "@/lib/firebaseConfig";
import Image from "next/image";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Redireciona se já estiver logado
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/home");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Recuperar e-mail salvo (opcional, apenas para UX)
  useEffect(() => {
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getAuth(app);
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      await signInWithEmailAndPassword(auth, email, password);

      // Salvar e-mail apenas se "Lembrar de mim" estiver marcado
      if (rememberMe) {
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("adminEmail");
      }

      router.push("/home");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      let msg = "Erro ao fazer login.";
      switch (error.code) {
        case "auth/invalid-email":
          msg = "E-mail inválido.";
          break;
        case "auth/user-disabled":
          msg = "Conta desativada.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          msg = "E-mail ou senha incorretos.";
          break;
        case "auth/too-many-requests":
          msg = "Muitas tentativas. Tente mais tarde.";
          break;
        default:
          msg = error.message || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-red-900 p-8 rounded-xl shadow-lg border border-slate-200 space-y-6"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/logo.svg"
              alt="Mimo Meu e Seu"
              width={100}
              height={60}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-[#FCE1D0]">Área Administrativa</h2>
        </div>

        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            autoFocus
            className="w-full p-3 pl-12 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-900"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-red-900"
            />
            <span className="text-white">Lembrar de mim</span>
          </label>
          <a href="/login/recuperar-senha" className="text-[#FCE1D0] hover:underline">
            Esqueceu a senha?
          </a>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FCE1D0] hover:bg-red-100 text-red-900 p-3 rounded-full font-medium transition disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-red-900 border-t-transparent rounded-full animate-spin mr-2"></span>
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
}