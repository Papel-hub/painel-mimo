"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db, auth } from "@/lib/firebaseConfig";
import Sidebar from "@/components/Sidebar";
import ConnectionStatus from "@/components/ConnectionStatus";
import { toast } from "react-hot-toast";
import { FaShieldAlt, FaUserPlus, FaTrash, FaToggleOff, FaToggleOn, FaSync } from "react-icons/fa";

interface Admin {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: any;
}

export default function GestaoAdministradores() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Função de busca memorizada para evitar loops
  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      // Criamos uma query ordenada por data de criação
      const q = query(collection(db, "admins"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const lista: Admin[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Admin[];

      setAdmins(lista);
    } catch (error: any) {
      console.error("Erro ao buscar:", error);
      if (error.code === "permission-denied") {
        toast.error("Sem permissão para ler o banco de dados.");
      } else {
        toast.error("Falha ao carregar administradores.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return toast.error("Insira um e-mail válido.");
    }

    setSubmitting(true);
    try {
      // 1. Criar no Firebase Auth
      // Nota: O Firebase Auth não permite criar usuários se você já estiver logado como um user comum.
      // Se der erro aqui, é porque você precisa de uma Firebase Admin SDK ou usar uma Cloud Function.
      // Como alternativa rápida, vamos salvar apenas no Firestore para validar o login.
      
      await createUserWithEmailAndPassword(auth, cleanEmail, "Mimo@2025");

      // 2. Criar no Firestore
      const docRef = doc(db, "admins", cleanEmail);
      const newAdminData = {
        email: cleanEmail,
        role,
        status: "ativo",
        createdAt: serverTimestamp(),
      };

      await setDoc(docRef, newAdminData);

      toast.success("Administrador criado!");
      setEmail("");
      fetchAdmins(); // Atualiza a lista automaticamente
    } catch (error: any) {
      console.error("Erro ao adicionar:", error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Este e-mail já está em uso no sistema.");
      } else {
        toast.error("Erro ao salvar no banco. Verifique as regras de segurança.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (admin: Admin) => {
    const newStatus = admin.status === "ativo" ? "suspenso" : "ativo";
    try {
      await updateDoc(doc(db, "admins", admin.id), { status: newStatus });
      toast.success("Status atualizado");
      fetchAdmins();
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleRemove = async (admin: Admin) => {
    if (!confirm(`Excluir permanentemente ${admin.email}?`)) return;
    try {
      await deleteDoc(doc(db, "admins", admin.id));
      toast.success("Removido com sucesso");
      fetchAdmins();
    } catch (error) {
      toast.error("Erro ao remover.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar onLogout={() => router.push("/login")} />
      
      <main className="ml-64 flex-1 p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><FaShieldAlt className="text-purple-600" /></div>
              Gestão de Acessos
            </h1>
            <p className="text-sm text-slate-500 mt-1">Controle quem pode acessar este painel</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchAdmins} 
              className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
              title="Recarregar lista"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
            </button>
            <ConnectionStatus />
          </div>
        </header>

        {/* Formulário */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Novo Administrador</h2>
          <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-mail@exemplo.com"
              className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-3 border border-slate-200 rounded-xl bg-slate-50 outline-none"
            >
              <option value="editor">Editor</option>
              <option value="master">Master</option>
              <option value="afiliado">Afiliado</option>
            </select>
            <button
              disabled={submitting}
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? "Processando..." : <><FaUserPlus /> Adicionar</>}
            </button>
          </form>
        </section>

        {/* Tabela */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-slate-400">Carregando dados...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">E-mail</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Cargo</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-bold text-slate-500 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Nenhum administrador encontrado.</td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 text-slate-700 font-medium">{admin.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 capitalize">{admin.role}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold ${admin.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button onClick={() => toggleStatus(admin)} className="text-slate-400 hover:text-blue-600">
                          {admin.status === "ativo" ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                        </button>
                        <button onClick={() => handleRemove(admin)} className="text-slate-400 hover:text-red-600">
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}