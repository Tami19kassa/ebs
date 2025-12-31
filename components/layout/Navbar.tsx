"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, User, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { LiveBar } from '../ui/LiveBar'; // Ensure this path is correct based on your folder structure

interface NavbarProps {
  tickerText?: string;
}

export const Navbar = ({ tickerText }: NavbarProps) => {
  // 1. Route Awareness: Hide Navbar if we are in the Admin Studio
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  // 2. State & Hooks
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleSearch, user, toggleAuthModal } = useAppStore();

  // Return null immediately if we are in the Studio
  if (isStudio) return null;

  // 3. Scroll Detection for Glass Effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // 4. Smooth Scroll Handler
  const handleScroll = (id: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu first
    
    // If we are not on the homepage, redirect first (optional logic depending on routing)
    if (pathname !== '/') {
        window.location.href = `/#${id}`;
        return;
    }

    const element = document.getElementById(id);
    if (element) {
      // Offset by 100px to account for the fixed header height
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Trending", id: "trending" },
    { name: "Originals", id: "originals" },
    { name: "News", id: "news", highlight: true },
    { name: "Live TV", id: "live", isLive: true },
  ];

  return (
    <>
      {/* 
         MASTER HEADER CONTAINER 
         Wraps LiveBar and Main Nav to ensure they stick together.
      */}
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
          isScrolled || isMobileMenuOpen 
            ? 'bg-ebs-dark/95 backdrop-blur-xl border-white/5 shadow-2xl' 
            : 'bg-linear-to-b from-black/90 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dynamic Live Ticker - only renders if text exists */}
        {tickerText && <LiveBar text={tickerText} />}

        <div className="max-w-[1400px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          
          {/* MOBILE: Hamburger Menu */}
          <button 
            className="md:hidden text-white hover:text-ebs-crimson transition-colors p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* BRAND LOGO */}
          <Link 
            href="/" 
            className="text-2xl md:text-3xl font-bold font-heading text-ebs-crimson tracking-wider flex-1 md:flex-none text-center md:text-left hover:opacity-90 transition-opacity"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            EBS<span className="text-white">PREMIER+</span>
          </Link>

          {/* DESKTOP: Navigation Links */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 mx-auto">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleScroll(link.id)}
                className={`hover:text-white transition-colors flex items-center gap-2 group py-2 ${
                    link.highlight ? 'text-ebs-crimson font-bold' : ''
                }`}
              >
                {link.isLive && (
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]" />
                )}
                <span className="relative">
                    {link.name}
                    {/* Underline Hover Animation */}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-ebs-crimson transition-all duration-300 group-hover:w-full" />
                </span>
              </button>
            ))}
          </div>

          {/* ACTIONS: Search & Auth */}
          <div className="flex items-center gap-4 md:gap-6 text-white justify-end flex-none md:flex-1 w-[28px] md:w-auto">
            <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSearch(true)}
                className="hover:text-ebs-crimson transition-colors"
            >
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !user && toggleAuthModal(true)}
              className="hidden md:flex items-center gap-2 group cursor-pointer"
            >
              {user ? (
                 <div className="flex items-center gap-2">
                     <span className="text-sm font-medium text-gray-300 group-hover:text-white">Hi, {user.name.split(' ')[0]}</span>
                     <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-ebs-crimson transition-colors object-cover" />
                 </div>
              ) : (
                <div className="bg-white/10 p-2 rounded-full hover:bg-ebs-crimson transition-colors">
                    <User className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* 
         MOBILE MENU DRAWER 
         Full screen overlay with cinematic entrance
      */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-ebs-dark pt-32 px-6 md:hidden overflow-y-auto"
          >
             <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleScroll(link.id)}
                    className={`flex items-center justify-between text-2xl font-heading font-bold text-white border-b border-white/10 pb-4 active:text-ebs-crimson active:bg-white/5 transition-colors ${
                        link.highlight ? 'text-ebs-crimson' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        {link.isLive && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />}
                        {link.name}
                    </div>
                    <ChevronRight className="text-gray-600" size={20} />
                  </motion.button>
                ))}

                {/* Mobile Auth Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                   {user ? (
                       <div className="bg-white/10 p-4 rounded-xl flex items-center gap-4">
                           <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                           <div>
                               <p className="font-bold text-white">{user.name}</p>
                               <button className="text-xs text-ebs-crimson uppercase font-bold tracking-wider mt-1">Manage Account</button>
                           </div>
                       </div>
                   ) : (
                       <button 
                        onClick={() => { toggleAuthModal(true); setIsMobileMenuOpen(false); }}
                        className="w-full bg-ebs-crimson text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                       >
                           <User size={20} />
                           Sign In / Register
                       </button>
                   )}
                </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};