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
  { gradient: "from-[hsl(230,70%,62%)] to-[hsl(255,55%,52%)]", accent: "hsl(230, 70%, 65%)" },
  { gradient: "from-[hsl(275,55%,58%)] to-[hsl(295,50%,46%)]", accent: "hsl(275, 55%, 62%)" },
  { gradient: "from-[hsl(15,80%,56%)] to-[hsl(35,75%,48%)]", accent: "hsl(18, 80%, 58%)" },
  { gradient: "from-[hsl(340,65%,56%)] to-[hsl(355,58%,46%)]", accent: "hsl(340, 65%, 58%)" },
  { gradient: "from-[hsl(168,55%,46%)] to-[hsl(185,50%,38%)]", accent: "hsl(168, 55%, 48%)" },
  { gradient: "from-[hsl(200,65%,52%)] to-[hsl(220,55%,44%)]", accent: "hsl(200, 65%, 55%)" },
  { gradient: "from-[hsl(45,70%,52%)] to-[hsl(30,65%,46%)]", accent: "hsl(45, 70%, 55%)" },
  { gradient: "from-[hsl(155,50%,46%)] to-[hsl(170,45%,38%)]", accent: "hsl(155, 50%, 48%)" },
];

export function ThemeCard({ theme, index }: ThemeCardProps) {
  const Icon = getIcon(theme.icon);
  const color = THEME_COLORS[index % THEME_COLORS.length];

  return (
    <Link to={`/tema/${theme.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-300 cursor-pointer h-full"
      >
        {/* Top gradient accent — thinner, more refined */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${color.gradient}`} />

        <div className="bg-card border border-border/30 border-t-0 rounded-b-2xl p-7 pb-6 flex flex-col h-full relative overflow-hidden">
          {/* Subtle hover glow */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none"
            style={{ backgroundColor: `${color.accent}12` }}
          />

          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color.accent}15` }}
          >
            <Icon className="w-6 h-6 relative z-10" style={{ color: color.accent }} />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{theme.title}</h3>
          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-2 mb-6 flex-1">
            {theme.description}
          </p>

          <div
            className="flex items-center font-semibold text-sm transition-all group-hover:gap-3 gap-2"
            style={{ color: color.accent }}
          >
            Utforsk tema
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}