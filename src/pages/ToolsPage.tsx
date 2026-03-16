import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useThemes, useAllThemeResources, useVideos } from "@/hooks/use-data";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { getIcon } from "@/lib/icons";
import { motion } from "framer-motion";
import { Wrench, ExternalLink, BookOpen, Play, Clock, ChevronRight } from "lucide-react";

const THEME_COLORS = [
  { accent: "hsl(230, 70%, 65%)", gradient: "from-[hsl(230,70%,65%)] to-[hsl(255,55%,52%)]" },
  { accent: "hsl(275, 55%, 62%)", gradient: "from-[hsl(275,55%,58%)] to-[hsl(295,50%,46%)]" },
  { accent: "hsl(18, 80%, 58%)", gradient: "from-[hsl(15,80%,56%)] to-[hsl(35,75%,48%)]" },
  { accent: "hsl(340, 65%, 58%)", gradient: "from-[hsl(340,65%,56%)] to-[hsl(355,58%,46%)]" },
  { accent: "hsl(168, 55%, 48%)", gradient: "from-[hsl(168,55%,46%)] to-[hsl(185,50%,38%)]" },
  { accent: "hsl(200, 65%, 55%)", gradient: "from-[hsl(200,65%,52%)] to-[hsl(220,55%,44%)]" },
  { accent: "hsl(45, 70%, 55%)", gradient: "from-[hsl(45,70%,52%)] to-[hsl(30,65%,46%)]" },
  { accent: "hsl(155, 50%, 48%)", gradient: "from-[hsl(155,50%,46%)] to-[hsl(170,45%,38%)]" },
];

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  book: "Bok",
  podcast: "Podcast",
  article: "Artikkel",
  tool: "Verktøy",
  other: "Annet",
};

export function getVisitedThemes(): string[] {
  try {
    return JSON.parse(localStorage.getItem("visited_themes") || "[]");
  } catch {
    return [];
  }
}

export function markThemeVisited(themeId: string) {
  const visited = getVisitedThemes();
  if (!visited.includes(themeId)) {
    visited.push(themeId);
    localStorage.setItem("visited_themes", JSON.stringify(visited));
  }
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const ToolsPage = () => {
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const { data: themes } = useThemes();
  const { data: allResources } = useAllThemeResources();
  const { data: allVideos } = useVideos();

  useEffect(() => {
    setVisitedIds(getVisitedThemes());
  }, []);

  const visitedThemes = themes?.filter((t) => visitedIds.includes(t.id)) ?? [];
  const hasVisited = visitedThemes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden noise">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[hsl(var(--primary)/0.06)] rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--theme-anxiety)/0.05)] rounded-full blur-[100px]" />
        </div>

        <main className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--theme-sleep))] mb-6 shadow-lg shadow-[hsl(var(--primary)/0.3)]">
              <Wrench className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Dine verktøy
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {hasVisited
                ? "Her finner du ressurser og videoer fra temaene du har utforsket."
                : "Du har ikke besøkt noen temaer ennå. Utforsk et tema for å se verktøy her."}
            </p>
          </motion.div>

          {!hasVisited && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Utforsk temaer
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* Visited themes with their resources */}
          <div className="space-y-16">
            {visitedThemes.map((theme, idx) => {
              const color = THEME_COLORS[idx % THEME_COLORS.length];
              const Icon = getIcon(theme.icon);
              const themeResources = allResources?.filter((r: any) => r.theme_id === theme.id) ?? [];
              const themeVideos = allVideos?.filter((v) => v.theme_id === theme.id) ?? [];

              return (
                <motion.section
                  key={theme.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.15, duration: 0.5 }}
                >
                  {/* Theme header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg`}
                      style={{ boxShadow: `0 4px 20px -4px ${color.accent}40` }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Link
                        to={`/tema/${theme.id}`}
                        className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {theme.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {themeVideos.length} videoer · {themeResources.length} ressurser
                      </p>
                    </div>
                  </div>

                  {/* Videos */}
                  {themeVideos.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <Play className="w-3.5 h-3.5" /> Videoer
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themeVideos.slice(0, 3).map((video) => {
                          const ytId = extractYouTubeId(video.url);
                          return (
                            <Link
                              key={video.id}
                              to={`/tema/${theme.id}/video/${video.id}`}
                              className="group glass rounded-xl border border-border/30 overflow-hidden hover:border-border/60 transition-all hover:card-shadow-hover"
                            >
                              {ytId && (
                                <div className="relative aspect-video bg-muted overflow-hidden">
                                  <img
                                    src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-10 h-10 text-white fill-white/90" />
                                  </div>
                                  <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-medium bg-black/70 text-white rounded-md flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {video.duration}
                                  </span>
                                </div>
                              )}
                              <div className="p-3">
                                <h4 className="font-semibold text-sm text-foreground line-clamp-1">{video.title}</h4>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Resources */}
                  {themeResources.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" /> Ressurser
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {themeResources.map((res: any) => (
                          <div
                            key={res.id}
                            className="glass rounded-xl border border-border/30 p-4 hover:border-border/60 transition-all hover:card-shadow-hover"
                          >
                            <span
                              className="inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md mb-2"
                              style={{
                                backgroundColor: `${color.accent}18`,
                                color: color.accent,
                              }}
                            >
                              {RESOURCE_TYPE_LABELS[res.type] || res.type}
                            </span>
                            <h4 className="font-semibold text-foreground mb-1">{res.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{res.description}</p>
                            {res.link && (
                              <a
                                href={res.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                                style={{ color: color.accent }}
                              >
                                Åpne <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.section>
              );
            })}
          </div>
        </main>
      </div>

      <HelpButton />
    </div>
  );
};

export default ToolsPage;
