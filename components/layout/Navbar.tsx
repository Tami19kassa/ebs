"use client";

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, Variants } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LiveBar } from '../ui/LiveBar';

interface NavbarProps {
  tickerText?: string;
}

export const Navbar = ({ tickerText }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isStudio = pathname?.startsWith('/studio');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleSearch, user, toggleAuthModal } = useAppStore();

  if (isStudio) return null;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleNavigation = (id: string, isLive?: boolean) => {
    setIsMobileMenuOpen(false);
    if (pathname === '/') {
        scrollToSection(id);
    } else {
        router.push(`/#${id}`);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    } else {
      if(id === 'home') window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Trending", id: "trending" },
    { name: "Originals", id: "originals" },
    { name: "News", id: "news", highlight: true },
    { name: "Live TV", id: "live", isLive: true },
  ];

  const menuVariants: Variants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: "100%", transition: { duration: 0.3 } }
  };

  const linkVariants: Variants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({ x: 0, opacity: 1, transition: { delay: i * 0.1 } })
  };

  const textColorClass = isScrolled ? "text-foreground" : "text-white";

  return (
    <>
      <motion.header
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent ${
          isScrolled 
            ? 'bg-[var(--bg-header)] backdrop-blur-md border-gray-500/10 shadow-sm' 
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tickerText && <LiveBar text={tickerText} />}

        <div className="max-w-[1400px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between relative">
          
          {/* MOBILE: Hamburger */}
          <button 
            className={`md:hidden hover:text-ebs-crimson transition-colors z-50 relative ${textColorClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {!isMobileMenuOpen && <Menu size={28} />}
          </button>

          {/* LOGO */}
          <Link 
            href="/" 
            className="flex items-center gap-2 z-50 flex-1 md:flex-none justify-center md:justify-start"
            onClick={() => scrollToSection('home')}
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/20 bg-white">
                <Image src="/logo.png" alt="EBS Logo" fill className="object-cover" />
            </div>
            <span className={`text-xl md:text-2xl font-bold font-heading tracking-wider transition-colors duration-300 ${textColorClass}`}>
              PREMIER<span className="text-ebs-crimson">+</span>
            </span>
          </Link>

          {/* 
             DESKTOP NAV - CENTERED
             FIX APPLIED: z-[60] ensures this layer is above the Icons layer
          */}
          <div className={`hidden md:flex gap-8 text-sm font-medium absolute left-1/2 transform -translate-x-1/2 z-[60] pointer-events-auto ${isScrolled ? 'text-muted' : 'text-gray-300'}`}>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavigation(link.id, link.isLive)}
                className={`hover:text-ebs-crimson transition-colors flex items-center gap-2 group py-2 ${link.highlight ? 'text-ebs-crimson font-bold' : ''}`}
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
          <div className={`flex items-center gap-3 md:gap-6 justify-end flex-none md:flex-1 w-[28px] md:w-auto z-50 ${textColorClass}`}>
            <ThemeToggle />
            <motion.button onClick={() => toggleSearch(true)}>
              <Search className="w-5 h-5 md:w-6 md:h-6 hover:text-ebs-crimson transition-colors" />
            </motion.button>
            <motion.button 
              onClick={() => !user && toggleAuthModal(true)}
              className="hidden md:flex items-center gap-2"
            >
              {user ? (
                 <div className="relative w-9 h-9">
                    <Image src={user.avatar || "/default-avatar.png"} alt="User" fill className="rounded-full border border-transparent hover:border-ebs-crimson transition-colors object-cover" />
                 </div>
              ) : (
                <div className={`p-2 rounded-full hover:bg-ebs-crimson transition-colors ${isScrolled ? 'bg-black/10 dark:bg-white/10' : 'bg-white/10'}`}>
                    <User className="w-5 h-5" />
                </div>
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
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-ebs-crimson rounded-full blur-[150px] opacity-10 pointer-events-none" />
            
            <div className="flex items-center justify-between px-6 h-20 md:h-24 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                        <Image src="/logo.png" alt="EBS" fill className="object-cover" />
                    </div>
                    <span className="text-xl font-bold font-heading text-foreground tracking-wider">
                        PREMIER<span className="text-ebs-crimson">+</span>
                    </span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ebs-crimson transition-colors"
                >
                    <X className="text-foreground" size={24} />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-8 overflow-y-auto">
                {navLinks.map((link, i) => (
                    <motion.button
                        key={link.name}
                        custom={i}
                        variants={linkVariants}
                        onClick={() => handleNavigation(link.id, link.isLive)}
                        className={`text-left group flex items-center justify-between ${link.highlight ? 'text-ebs-crimson' : 'text-foreground'}`}
                    >
                        <span className={`text-4xl md:text-5xl font-heading font-bold transition-all duration-300 group-hover:pl-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${link.highlight ? 'from-ebs-crimson to-white' : 'from-foreground to-gray-400'}`}>
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
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-8 border-t border-white/5 relative z-10"
            >
                {user ? (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="relative w-12 h-12">
                            <Image src={user.avatar || "/default-avatar.png"} alt="User" fill className="rounded-full object-cover" />
                        </div>
                        <div>
                            <p className="text-foreground font-bold text-lg">{user.name}</p>
                            <button className="text-ebs-crimson text-sm font-medium">Manage Account</button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => { toggleAuthModal(true); setIsMobileMenuOpen(false); }}
                        className="w-full py-5 rounded-xl bg-gradient-to-r from-ebs-crimson to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-900/30 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                    >
                        <LogIn size={20} />
                        Sign In / Register
                    </button>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};