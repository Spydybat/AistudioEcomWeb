import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { useAdmin } from "../../context/AdminContext";
import { ADMIN_CREDENTIALS } from "../../data/adminData";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const success = login(email, password);
    if (success) {
      navigate("/admin");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111214] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
            Aura Admin
          </h1>
          <p className="text-zinc-400 text-sm mt-2">Sign in to manage your store</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#1E1F22] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aura.studio"
                className="w-full pl-10 pr-4 py-3 bg-[#111214] border border-white/5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-white placeholder-zinc-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 bg-[#111214] border border-white/5 rounded-lg focus:outline-none focus:border-indigo-500 text-sm text-white placeholder-zinc-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-500 text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <p className="text-center text-[10px] text-zinc-500 font-mono">
            Demo: {ADMIN_CREDENTIALS.email}
          </p>
        </form>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-center text-zinc-500 text-xs uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
        >
          Back to Store
        </button>
      </div>
    </div>
  );
}
