import { useParams, Link } from "react-router-dom";
import { useTheme, useVideos, useThemeResources } from "@/hooks/use-data";
import { getIcon } from "@/lib/icons";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Play, Clock, BookOpen, ExternalLink, Image } from "lucide-react";
import { motion } from "framer-motion";

const THEME_ACCENTS = [
  "hsl(230, 70%, 65%)",
  "hsl(280, 60%, 60%)",
  "hsl(15, 80%, 58%)",
  "hsl(340, 65%, 58%)",
  "hsl(168, 50%, 50%)",
  "hsl(200, 65%, 55%)",
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
        {/* Intro text */}
        {theme.intro_text && (
          <section className="mb-10">
            <div className="bg-card rounded-2xl card-shadow border border-border/50 p-8">
              <p className="text-foreground leading-relaxed whitespace-pre-line">{theme.intro_text}</p>
            </div>
          </section>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <section className="mb-12">
            <p className="text-sm text-muted-foreground mb-6">{videos.length} videoer</p>
            <div className="space-y-4">
              {videos.map((video, i) => (
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
          </section>
        )}

        {/* Resources */}
        {resources && resources.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-bold text-foreground">Anbefalte ressurser</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((resource: any, i: number) => {
                const typeLabel = RESOURCE_TYPE_LABELS[resource.type] ?? resource.type;
                return (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden hover:border-border transition-all group h-full flex flex-col">
                      {/* Image */}
                      {resource.image_url ? (
                        <div className="aspect-[3/4] max-h-56 overflow-hidden bg-muted">
                          <img
                            src={resource.image_url}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="h-32 bg-muted/50 flex items-center justify-center">
                          <Image className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="text-xs font-medium rounded-full px-2.5 py-0.5"
                            style={{ backgroundColor: `${accent}15`, color: accent }}
                          >
                            {typeLabel}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-base mb-1">{resource.title}</h3>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{resource.description}</p>
                        )}
                        {resource.link && (
                          <a
                            href={resource.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium hover:underline transition-colors"
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
          <p className="text-muted-foreground text-center py-12">Ingen innhold lagt til ennå.</p>
        )}
      </main>
      <HelpButton />
    </div>
  );
};

export default ThemePage;
