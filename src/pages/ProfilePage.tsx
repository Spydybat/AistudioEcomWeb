import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useShop } from "../context/ShopContext";
import { User, Mail, Shield, Camera, Edit2, X, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function ProfilePage() {
  const { user, showToast } = useShop();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initials = fullName.substring(0, 2).toUpperCase();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast("Full name cannot be empty", "info");
      return;
    }
    setIsSaving(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: editName.trim() }
      });
      if (authError) throw authError;

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: editName.trim() })
        .eq('id', user.id);
      
      if (dbError) {
        console.error("Profile update error", dbError);
      }

      showToast("Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast(err.message || "Failed to update profile", "info");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-zinc-50 pt-10 pb-20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-sans font-bold text-black uppercase tracking-tight">My Profile</h1>
          <p className="text-sm text-zinc-500 mt-2 font-medium">Manage your personal information and preferences.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / Avatar Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-zinc-100 to-zinc-200" />
              
              <div className="relative z-10 w-32 h-32 rounded-full bg-white p-2 mt-4 shadow-sm">
                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-white text-3xl font-bold tracking-widest relative overflow-hidden group">
                  {initials}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-black">{fullName}</h2>
              <p className="text-sm text-zinc-500 font-medium truncate w-full">{user.email}</p>
              
              <button 
                onClick={() => {
                  setEditName(fullName);
                  setIsEditModalOpen(true);
                }}
                className="mt-6 w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-black uppercase tracking-tight">Account Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-sm font-medium text-black">
                      {fullName}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-sm font-medium text-black truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Account Status
                  </label>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-sm font-bold uppercase tracking-widest inline-block">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
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
                  onClick={() => setIsEditModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-black bg-zinc-50 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-sans font-bold text-black mb-2 tracking-tight uppercase">
                    Edit Profile
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium">
                    Update your personal information.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider pl-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all font-medium"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left opacity-60">
                    <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider pl-1">
                      Email Address (Read-only)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                      <input
                        type="email"
                        value={user.email || ""}
                        readOnly
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl py-3 pl-10 pr-4 text-zinc-900 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving || !editName.trim()}
                    className="w-full bg-black hover:bg-zinc-800 text-white font-semibold tracking-widest text-[10px] uppercase py-4 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-sm disabled:opacity-70 cursor-pointer"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
