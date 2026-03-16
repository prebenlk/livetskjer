import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Theme } from "@/data/themes";

interface ThemeCardProps {
  theme: Theme;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const Icon = theme.icon;

  return (
    <Link to={`/tema/${theme.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="group relative bg-card p-8 rounded-[20px] card-shadow hover:card-shadow-hover border border-border/50 transition-shadow cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
          <Icon className="text-primary w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{theme.title}</h3>
        <p className="text-muted-foreground leading-relaxed line-clamp-2 text-sm">
          {theme.description}
        </p>
        <div className="mt-6 flex items-center text-primary font-medium text-sm">
          Utforsk tema
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>
    </Link>
  );
}
