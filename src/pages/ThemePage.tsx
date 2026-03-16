import { useParams, Link } from "react-router-dom";
import { useTheme, useVideos, useThemeResources } from "@/hooks/use-data";
import { getIcon } from "@/lib/icons";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Play, Clock, BookOpen, ExternalLink, Image } from "lucide-react";
import { motion } from "framer-motion";

const THEME_ACCENTS = [
  "hsl(230, 70%, 65%)",
  "hsl(275, 55%, 62%)",
  "hsl(18, 80%, 58%)",
  "hsl(340, 65%, 58%)",
  "hsl(168, 55%, 48%)",
  "hsl(200, 65%, 55%)",
  "hsl(45, 70%, 55%)",
  "hsl(155, 50%, 48%)",
];

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  book: "Bok",
  podcast: "Podcast",
  article: "Artikkel",
  tool: "Verktøy",
  other: "Annet",
};

const ThemePage = () => {
  const { themeId } = useParams();
  const { data: theme, isLoading: themeLoading } = useTheme(themeId);
  const { data: videos, isLoading: videosLoading } = useVideos(themeId);
  const { data: resources, isLoading: resourcesLoading } = useThemeResources(themeId);

  if (themeLoading || videosLoading || resourcesLoading) {
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
  const accent = THEME_ACCENTS[theme.sort_order % THEME_ACCENTS.length];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-border/20 noise">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${accent}, transparent 60%), radial-gradient(ellipse at 80% 80%, ${accent}, transparent 50%)`,
          }}
        />
        <div className="max-w-5xl mx-auto px-6 py-14 md:py-16 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Tilbake til alle temaer
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-6"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
              style={{
                backgroundColor: `${accent}18`,
                boxShadow: `0 0 40px -8px ${accent}25`,
              }}
            >
              <Icon className="w-8 h-8" style={{ color: accent }} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
                {theme.title}
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl text-base leading-relaxed">
                {theme.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 md:py-12">
        {/* Intro text */}
        {theme.intro_text && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-12"
          >
            <div className="glass rounded-2xl border border-border/30 p-8 md:p-10">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-base">
                {theme.intro_text}
              </p>
            </div>
          </motion.section>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Videoer</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                {videos.length}
              </span>
            </div>
            <div className="space-y-3">
              {videos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                >
                  <Link to={`/tema/${themeId}/video/${video.id}`}>
                    <div className="bg-card rounded-xl card-shadow border border-border/30 p-5 md:p-6 hover:card-shadow-hover transition-all duration-300 group cursor-pointer hover:border-border/60">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-foreground transition-colors truncate">
                            {video.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {video.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5 tabular-nums">
                            <Clock className="w-3.5 h-3.5" />
                            {video.duration}
                          </span>
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                            style={{ backgroundColor: `${accent}12` }}
                          >
                            <Play
                              className="w-4 h-4 transition-transform group-hover:scale-110"
                              style={{ color: accent }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Resources */}
        {resources && resources.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Anbefalte ressurser</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((resource: any, i: number) => {
                const typeLabel = RESOURCE_TYPE_LABELS[resource.type] ?? resource.type;
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    <div className="bg-card rounded-2xl card-shadow border border-border/30 overflow-hidden hover:border-border/60 transition-all duration-300 group h-full flex flex-col">
                      {resource.image_url ? (
                        <div className="aspect-[3/4] max-h-56 overflow-hidden bg-muted">
                          <img
                            src={resource.image_url}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="h-28 bg-muted/30 flex items-center justify-center">
                          <Image className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-xs font-semibold rounded-full px-2.5 py-0.5"
                            style={{ backgroundColor: `${accent}12`, color: accent }}
                          >
                            {typeLabel}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-base mb-1.5">{resource.title}</h3>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
                            {resource.description}
                          </p>
                        )}
                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold hover:underline transition-colors"
                            style={{ color: accent }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Åpne ressurs
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {(!videos || videos.length === 0) && (!resources || resources.length === 0) && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Ingen innhold lagt til ennå.</p>
          </div>
        )}
      </main>
      <HelpButton />
    </div>
  );
};

export default ThemePage;