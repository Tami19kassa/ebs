"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, X, ChevronRight, LogIn } from 'lucide-react';
// 1. ADD 'Variants' TO THIS IMPORT
import { motion, AnimatePresence, useScroll, useMotionValueEvent, Variants } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { LiveBar } from '../ui/LiveBar';

interface NavbarProps {
  tickerText?: string;
}

export const Navbar = ({ tickerText }: NavbarProps) => {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleSearch, user, toggleAuthModal } = useAppStore();

  if (isStudio) return null;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleScroll = (id: string) => {
    setIsMobileMenuOpen(false); 
    if (pathname !== '/') {
        window.location.href = `/#${id}`;
        return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Trending", id: "trending" },
    { name: "Originals", id: "originals" },
    { name: "News", id: "news", highlight: true },
    { name: "Live TV", id: "live", isLive: true },
  ];

  // 2. EXPLICITLY TYPE THIS AS 'Variants'
  const menuVariants: Variants = {
    closed: { opacity: 0, x: "100%" },
    open: { 
      opacity: 1, 
      x: 0, 
      transition: { type: "spring", stiffness: 300, damping: 30 } 
    },
    exit: { 
      opacity: 0, 
      x: "100%", 
      transition: { duration: 0.3 } 
    }
  };

  // 3. EXPLICITLY TYPE THIS AS 'Variants' TOO
  const linkVariants: Variants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({ 
      x: 0, 
      opacity: 1, 
      transition: { delay: i * 0.1 } 
    })
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
          isScrolled 
            ? 'bg-ebs-dark/90 backdrop-blur-md border-white/5 shadow-2xl' 
            : 'bg-gradient-to-b from-black/90 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tickerText && <LiveBar text={tickerText} />}

        <div className="max-w-[1400px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* MOBILE: Hamburger */}
          <button 
            className="md:hidden text-white hover:text-ebs-crimson transition-colors z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {!isMobileMenuOpen && <Menu size={28} />}
          </button>

          {/* LOGO */}
          <Link 
            href="/" 
            className="text-2xl md:text-3xl font-bold font-heading text-ebs-crimson tracking-wider flex-1 md:flex-none text-center md:text-left z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            EBS<span className="text-white">PREMIER+</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 mx-auto">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleScroll(link.id)}
                className={`hover:text-white transition-colors flex items-center gap-2 group py-2 ${link.highlight ? 'text-ebs-crimson font-bold' : ''}`}
              >
                {link.isLive && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />}
                <span className="relative">
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-ebs-crimson transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
            ))}
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-4 md:gap-6 text-white justify-end flex-none md:flex-1 w-[28px] md:w-auto z-50">
            <motion.button onClick={() => toggleSearch(true)}>
              <Search className="w-5 h-5 md:w-6 md:h-6 hover:text-ebs-crimson transition-colors" />
            </motion.button>
            <motion.button 
              onClick={() => !user && toggleAuthModal(true)}
              className="hidden md:flex items-center gap-2"
            >
              {user ? (
                 <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border border-transparent hover:border-ebs-crimson transition-colors object-cover" />
              ) : (
                <div className="bg-white/10 p-2 rounded-full hover:bg-ebs-crimson transition-colors"><User className="w-5 h-5" /></div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 z-[60] bg-ebs-dark/95 backdrop-blur-xl flex flex-col"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-ebs-crimson rounded-full blur-[150px] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-ebs-purple rounded-full blur-[100px] opacity-20 pointer-events-none" />

            {/* Menu Header */}
            <div className="flex items-center justify-between px-6 h-20 md:h-24 border-b border-white/5 relative z-10">
                <span className="text-2xl font-bold font-heading text-ebs-crimson tracking-wider">
                    EBS<span className="text-white">PREMIER+</span>
                </span>
                <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ebs-crimson transition-colors"
                >
                    <X className="text-white" size={24} />
                </button>
            </div>

            {/* Links List */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-8 overflow-y-auto">
                {navLinks.map((link, i) => (
                    <motion.button
                        key={link.name}
                        custom={i}
                        variants={linkVariants}
                        onClick={() => handleScroll(link.id)}
                        className={`text-left group flex items-center justify-between ${link.highlight ? 'text-ebs-crimson' : 'text-white'}`}
                    >
                        <span className={`text-4xl md:text-5xl font-heading font-bold transition-all duration-300 group-hover:pl-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${link.highlight ? 'from-ebs-crimson to-white' : 'from-white to-gray-400'}`}>
                            {link.name}
                        </span>
                        {link.isLive && (
                            <span className="px-3 py-1 bg-red-600/20 border border-red-500 text-red-500 text-xs font-bold tracking-widest rounded uppercase animate-pulse">
                                Live
                            </span>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Menu Footer / Auth */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-8 border-t border-white/5 relative z-10"
            >
                {user ? (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <img src={user.avatar} alt="User" className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <p className="text-white font-bold text-lg">{user.name}</p>
                            <button className="text-ebs-crimson text-sm font-medium">Manage Account</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => { toggleAuthModal(true); setIsMobileMenuOpen(false); }}
                        className="w-full py-5 rounded-xl bg-gradient-to-r from-ebs-crimson to-red-700 text-white font-bold text-lg shadow-lg shadow-red-900/30 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <LogIn size={20} />
                        Sign In / Register
                    </button>
                )}
                
                <div className="mt-6 flex justify-center gap-6 text-gray-500 text-xs tracking-widest uppercase">
                    <span>Privacy</span>
                    <span>•</span>
                    <span>Terms</span>
                    <span>•</span>
                    <span>Help</span>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};