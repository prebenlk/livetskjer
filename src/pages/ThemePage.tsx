import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTheme, useVideos, useThemeResources } from "@/hooks/use-data";
import { getIcon } from "@/lib/icons";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Play, Clock, BookOpen, ExternalLink, ChevronRight, Book, Headphones, Globe, Smartphone, Instagram, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { markThemeVisited } from "@/pages/ToolsPage";

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

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; icon: any; gradient: string; bg: string }> = {
  book: { label: "Bøker & Lydbøker", icon: Book, gradient: "from-amber-500/80 to-orange-600/80", bg: "amber" },
  podcast: { label: "Podcaster", icon: Mic, gradient: "from-violet-500/80 to-purple-600/80", bg: "violet" },
  article: { label: "Nettsider & Instagram", icon: Globe, gradient: "from-sky-500/80 to-blue-600/80", bg: "sky" },
  tool: { label: "Apper", icon: Smartphone, gradient: "from-emerald-500/80 to-teal-600/80", bg: "emerald" },
  other: { label: "Annet", icon: BookOpen, gradient: "from-slate-500/80 to-gray-600/80", bg: "slate" },
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:embed\/|v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const ThemePage = () => {
  const { themeId } = useParams();
  const { data: theme, isLoading: themeLoading } = useTheme(themeId);
  const { data: videos, isLoading: videosLoading } = useVideos(themeId);
  const { data: resources, isLoading: resourcesLoading } = useThemeResources(themeId);

  useEffect(() => {
    if (themeId) markThemeVisited(themeId);
  }, [themeId]);

  if (themeLoading || videosLoading || resourcesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted/30 rounded-2xl" />
            <div className="h-40 bg-muted/20 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-44 bg-muted/20 rounded-2xl" />
              <div className="h-44 bg-muted/20 rounded-2xl" />
            </div>
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
  const colorSet = THEME_COLORS[theme.sort_order % THEME_COLORS.length];
  const accent = colorSet.accent;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Immersive Hero */}
      <div className="relative overflow-hidden noise">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background: `
                radial-gradient(ellipse at 15% 40%, ${accent}, transparent 55%),
                radial-gradient(ellipse at 85% 70%, ${accent}, transparent 50%)
              `,
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${accent}, transparent)`,
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-10 pb-14 md:pt-12 md:pb-16 relative">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Tilbake til alle temaer
            </Link>
          </motion.div>

          {/* Theme identity */}
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br ${colorSet.gradient} flex items-center justify-center shrink-0 shadow-xl`}
              style={{ boxShadow: `0 12px 40px -8px ${accent}40` }}
            >
              <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                {theme.title}
              </h1>
              <p className="text-muted-foreground mt-3 max-w-xl text-base md:text-lg leading-relaxed">
                {theme.description}
              </p>

              {/* Quick stats */}
              <div className="flex items-center gap-4 mt-5">
                {videos && videos.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    <Play className="w-3 h-3" />
                    {videos.length} {videos.length === 1 ? "video" : "videoer"}
                  </span>
                )}
                {resources && resources.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                  >
                    <BookOpen className="w-3 h-3" />
                    {resources.length} {resources.length === 1 ? "ressurs" : "ressurser"}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 md:py-14">
        {/* Intro text with styled paragraphs */}
        {theme.intro_text && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-14"
          >
            <div className="relative glass rounded-2xl border border-border/30 p-8 md:p-10 overflow-hidden">
              {/* Accent line on left */}
              <div
                className="absolute left-0 top-6 bottom-6 w-1 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <div className="pl-5 space-y-4">
                {theme.intro_text.split("\n\n").map((paragraph: string, i: number) => (
                  <p key={i} className="text-foreground/85 leading-relaxed text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Videos — card grid with thumbnails */}
        {videos && videos.length > 0 && (
          <section className="mb-14">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${accent}15` }}
              >
                <Play className="w-4 h-4" style={{ color: accent }} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Videoer</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {videos.map((video, i) => {
                const ytId = extractYouTubeId(video.url);
                const thumbnail = ytId
                  ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                  : null;

                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.25 }}
                  >
                    <Link to={`/tema/${themeId}/video/${video.id}`}>
                      <div className="group bg-card rounded-2xl card-shadow border border-border/30 overflow-hidden hover:card-shadow-hover hover:border-border/60 transition-all duration-300 cursor-pointer h-full">
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-muted/30 overflow-hidden">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-10 h-10 text-muted-foreground/30" />
                            </div>
                          )}
                          {/* Play overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 backdrop-blur-sm"
                              style={{ backgroundColor: `${accent}e0` }}
                            >
                              <Play className="w-6 h-6 text-white ml-0.5" />
                            </div>
                          </div>
                          {/* Duration badge */}
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-5">
                          <h3 className="font-bold text-foreground text-base leading-snug mb-1.5 group-hover:text-foreground transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Resources — grouped by type */}
        {resources && resources.length > 0 && (() => {
          const grouped = resources.reduce((acc: Record<string, any[]>, r: any) => {
            const type = r.type || "other";
            if (!acc[type]) acc[type] = [];
            acc[type].push(r);
            return acc;
          }, {});
          const typeOrder = ["book", "podcast", "article", "tool", "other"];
          const sortedTypes = typeOrder.filter(t => grouped[t]);

          return (
            <section className="space-y-12">
              {sortedTypes.map((type, gi) => {
                const config = RESOURCE_TYPE_CONFIG[type] || RESOURCE_TYPE_CONFIG.other;
                const TypeIcon = config.icon;
                const items = grouped[type];

                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.1 + 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <TypeIcon className="w-4.5 h-4.5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">{config.label}</h2>
                      <span className="text-xs text-muted-foreground font-medium ml-1">({items.length})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((resource: any, i: number) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 + gi * 0.1 + 0.35 }}
                        >
                          <div className="bg-card rounded-xl card-shadow border border-border/30 overflow-hidden hover:border-border/60 hover:card-shadow-hover transition-all duration-300 group h-full flex flex-col">
                            {resource.image_url ? (
                              <div className="aspect-[3/4] max-h-48 overflow-hidden bg-muted/30">
                                <img
                                  src={resource.image_url}
                                  alt={resource.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className={`h-20 bg-gradient-to-br ${config.gradient} opacity-20 flex items-center justify-center relative overflow-hidden`}>
                                <TypeIcon className="w-10 h-10 text-foreground/10 absolute -right-2 -bottom-2 rotate-12 scale-150" />
                              </div>
                            )}

                            <div className="p-4 flex flex-col flex-1">
                              <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{resource.title}</h3>
                              {resource.description && resource.description !== type && (
                                <p className="text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
                                  {resource.description}
                                </p>
                              )}
                              {resource.link && (
                                <a
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold hover:gap-2 transition-all"
                                  style={{ color: accent }}
                                >
                                  Åpne
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </section>
          );
        })()}

        {/* Empty state */}
        {(!videos || videos.length === 0) && (!resources || resources.length === 0) && (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${accent}15` }}
            >
              <Icon className="w-8 h-8" style={{ color: accent }} />
            </div>
            <p className="text-muted-foreground text-lg">Innhold kommer snart.</p>
          </div>
        )}
      </main>
      <HelpButton />
    </div>
  );
};

export default ThemePage;