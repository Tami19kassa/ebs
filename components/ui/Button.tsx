"use client";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ className, variant = 'primary', children, ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-ebs-crimson text-white hover:bg-red-700",
    secondary: "bg-white/20 backdrop-blur-md text-white hover:bg-white/30",
    ghost: "bg-transparent text-white hover:text-ebs-crimson",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn("px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2", variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
};