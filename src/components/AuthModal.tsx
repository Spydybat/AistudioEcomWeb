import React, { useState } from "react";
import { X, Mail, Lock, Loader2, LogIn, UserPlus, User, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../supabaseClient";
import { useShop } from "../context/ShopContext";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, showToast } = useShop();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields", "info");
      return;
    }
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (data.user) {
          const { data: profile, error: profileErr } = await supabase.from('profiles').select('id').eq('id', data.user.id).maybeSingle();
          if (profileErr) throw profileErr;
          if (!profile) {
            const { error: insertErr } = await supabase.from('profiles').insert([{ 
              id: data.user.id,
              email: email,
              role: 'customer',
              status: 'active'
            }]);
            if (insertErr) throw insertErr;
          }
        }
        
        showToast("Successfully logged in!");
        setIsAuthModalOpen(false);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data.user) {
          const { data: profile, error: profileErr } = await supabase.from('profiles').select('id').eq('id', data.user.id).maybeSingle();
          if (profileErr) throw profileErr;
          if (!profile) {
            const { error: insertErr } = await supabase.from('profiles').insert([{ 
              id: data.user.id,
              full_name: fullName || email.split('@')[0],
              email: email,
              phone: phone || null,
              role: 'customer',
              status: 'active'
            }]);
            if (insertErr) throw insertErr;
          }
        }

        showToast("Account created successfully!");
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      showToast(err.message || "An error occurred", "info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
          >
            <div className="bg-white border border-zinc-100 rounded-3xl p-6 sm:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-black" />
              
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-black bg-zinc-50 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-sans font-bold text-black mb-2 tracking-tight uppercase">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-zinc-500 text-sm font-medium">
                  {isLogin
                    ? "Enter your details to access your account."
                    : "Join us to save your wishlist and cart."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider pl-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all font-medium"
                          placeholder="John Doe"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider pl-1">
                        Phone (Optional)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all font-medium"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider pl-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all font-medium"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider pl-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all font-medium"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black hover:bg-zinc-800 text-white font-semibold tracking-widest text-[10px] uppercase py-4 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-sm disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" /> Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" /> Create Account
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer"
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
