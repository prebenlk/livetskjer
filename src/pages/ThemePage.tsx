import { useParams, Link } from "react-router-dom";
import { useTheme, useVideos } from "@/hooks/use-data";
import { getIcon } from "@/lib/icons";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Play, Clock } from "lucide-react";
import { motion } from "framer-motion";

const THEME_ACCENTS = [
  "hsl(230, 70%, 65%)",
  "hsl(280, 60%, 60%)",
  "hsl(15, 80%, 58%)",
  "hsl(340, 65%, 58%)",
  "hsl(168, 50%, 50%)",
  "hsl(200, 65%, 55%)",
];

const ThemePage = () => {
  const { themeId } = useParams();
  const { data: theme, isLoading: themeLoading } = useTheme(themeId);
  const { data: videos, isLoading: videosLoading } = useVideos(themeId);

  if (themeLoading || videosLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground">Tema ikke funnet.</p>
        </div>
      </div>
    );
  }

  const Icon = getIcon(theme.icon);
  // Use sort_order to pick a consistent accent color
  const accent = THEME_ACCENTS[theme.sort_order % THEME_ACCENTS.length];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-border/30">
        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent}, transparent 70%)` }} />
        <div className="max-w-5xl mx-auto px-6 py-12 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til alle temaer
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${accent}20` }}
            >
              <Icon className="w-8 h-8" style={{ color: accent }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{theme.title}</h1>
              <p className="text-muted-foreground mt-1.5 max-w-xl">{theme.description}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-sm text-muted-foreground mb-6">{videos?.length ?? 0} videoer</p>
        <div className="space-y-4">
          {videos?.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/tema/${themeId}/video/${video.id}`}>
                <div className="bg-card rounded-2xl card-shadow border border-border/50 p-6 hover:card-shadow-hover transition-all group cursor-pointer hover:border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{video.description}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {video.duration}
                      </span>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                        style={{ backgroundColor: `${accent}15` }}
                      >
                        <Play className="w-4 h-4" style={{ color: accent }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <HelpButton />
    </div>
  );
};

export default ThemePage;
