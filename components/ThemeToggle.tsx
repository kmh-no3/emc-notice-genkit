"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみレンダリング
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-10 h-10 relative overflow-hidden transition-all duration-300 hover:bg-primary/10"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === "dark" ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Sun className="h-5 w-5 absolute inset-0 m-auto rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="h-5 w-5 absolute inset-0 m-auto rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </motion.div>
        <span className="sr-only">テーマ切り替え</span>
      </Button>
    </motion.div>
  );
}
