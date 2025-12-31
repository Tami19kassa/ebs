"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { X } from "lucide-react";
import { Button } from "../ui/Button";

export const AuthModal = () => {
  const { isAuthModalOpen, toggleAuthModal, login } = useAppStore();

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock Login
      login({ id: 'u1', name: 'Demo User', avatar: 'https://i.pravatar.cc/150?u=ebs' });
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => toggleAuthModal(false)}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-ebs-charcoal w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-2xl"
          >
             <button onClick={() => toggleAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={24} />
             </button>

             <h2 className="text-3xl font-heading text-white mb-6 text-center">Welcome Back</h2>
             
             <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input type="email" required className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-ebs-crimson outline-none transition-colors" placeholder="user@ebs.com" />
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                    <input type="password" required className="w-full bg-black/30 border border-gray-700 rounded p-3 text-white focus:border-ebs-crimson outline-none transition-colors" placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full justify-center">Sign In</Button>
             </form>
             
             <p className="text-center text-xs text-gray-500 mt-6">
                Use any credentials. This is a simulation.
             </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};