import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getIcon } from "@/lib/icons";
import type { Tables } from "@/integrations/supabase/types";

interface ThemeCardProps {
  theme: Tables<"themes"> & { videoCount: number };
  index: number;
}

const THEME_COLORS = [
  { bg: "from-[hsl(230,70%,65%)] to-[hsl(250,60%,50%)]", accent: "hsl(230, 70%, 65%)", glow: "hsl(230, 70%, 65%)" },
  { bg: "from-[hsl(280,60%,60%)] to-[hsl(300,50%,45%)]", accent: "hsl(280, 60%, 60%)", glow: "hsl(280, 60%, 60%)" },
  { bg: "from-[hsl(15,80%,58%)] to-[hsl(35,75%,50%)]", accent: "hsl(15, 80%, 58%)", glow: "hsl(15, 80%, 58%)" },
  { bg: "from-[hsl(340,65%,58%)] to-[hsl(355,60%,48%)]", accent: "hsl(340, 65%, 58%)", glow: "hsl(340, 65%, 58%)" },
  { bg: "from-[hsl(168,50%,50%)] to-[hsl(185,55%,40%)]", accent: "hsl(168, 50%, 50%)", glow: "hsl(168, 50%, 50%)" },
  { bg: "from-[hsl(200,65%,55%)] to-[hsl(220,60%,45%)]", accent: "hsl(200, 65%, 55%)", glow: "hsl(200, 65%, 55%)" },
];

export function ThemeCard({ theme, index }: ThemeCardProps) {
  const Icon = getIcon(theme.icon);
  const color = THEME_COLORS[index % THEME_COLORS.length];

  return (
    <Link to={`/tema/${theme.id}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-2xl card-shadow hover:card-shadow-hover transition-shadow cursor-pointer h-full"
      >
        {/* Gradient top band */}
        <div className={`h-2 w-full bg-gradient-to-r ${color.bg}`} />

        <div className="bg-card border border-border/50 border-t-0 p-7 pb-6 rounded-b-2xl">
          {/* Icon with colored glow */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative"
            style={{ backgroundColor: `${color.accent}20` }}
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{ backgroundColor: `${color.glow}30` }}
            />
            <Icon className="w-7 h-7 relative z-10" style={{ color: color.accent }} />
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">{theme.title}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2 mb-5">
            {theme.description}
          </p>

          <div
            className="flex items-center font-semibold text-sm transition-colors"
            style={{ color: color.accent }}
          >
            Utforsk tema
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1.5" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
