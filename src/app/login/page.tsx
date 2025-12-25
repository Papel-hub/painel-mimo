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
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Importar Firestore
import { app } from "@/lib/firebaseConfig";
import Image from "next/image";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const db = getFirestore(app);
const auth = getAuth(app);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/home");
    });
    return () => unsubscribe();
  }, [router]);

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
      // 1. Configurar persistência
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      // 2. Tentar o login básico
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. VERIFICAÇÃO DE PERMISSÃO NO FIRESTORE
      // Supondo que você tenha uma coleção "admins" onde o ID do documento é o e-mail
      const adminRef = doc(db, "admins", user.email!.toLowerCase());
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        // Se não estiver na lista, desloga imediatamente
        await signOut(auth);
        throw new Error("access-denied");
      }

      // 4. Sucesso
      if (rememberMe) {
        localStorage.setItem("adminEmail", email);
      } else {
        localStorage.removeItem("adminEmail");
      }

      router.push("/home");
    } catch (err: any) {
      console.error(err);
      let msg = "Erro ao fazer login.";
      
      if (err.message === "access-denied") {
        msg = "Acesso negado. Este e-mail não tem permissão de administrador.";
      } else {
        switch (err.code) {
          case "auth/invalid-credential":
            msg = "E-mail ou senha incorretos.";
            break;
          case "auth/too-many-requests":
            msg = "Muitas tentativas. Tente mais tarde.";
            break;
          default:
            msg = "Falha na autenticação. Verifique seus dados.";
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCE1D0] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4 transition-transform hover:scale-105">
            <Image
              src="/images/logo.svg"
              alt="Mimo Meu e Seu"
              width={120}
              height={80}
              priority
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-red-900">Painel Administrativo</h2>
          <p className="text-slate-500 text-sm mt-2">Entre com suas credenciais autorizadas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* E-mail */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Senha</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full p-3 pl-12 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-900 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Opções extras */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 transition-all"
              />
              <span className="text-slate-600 group-hover:text-red-900 transition-colors">Lembrar de mim</span>
            </label>
            <a href="/login/recuperar-senha" className="text-red-700 font-medium hover:text-red-900 transition-colors">
              Esqueceu a senha?
            </a>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 hover:bg-red-800 text-white p-4 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Autenticando...
              </span>
            ) : (
              "Acessar Painel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}