import { useThemes, useSiteSettings } from "@/hooks/use-data";
import { ThemeCard } from "@/components/ThemeCard";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { motion } from "framer-motion";

const Index = () => {
  const { data: themes, isLoading } = useThemes();
  const { data: settings } = useSiteSettings();

  const heroTitle = settings?.hero_title ?? "Verktøy for en bedre hverdag";
  const heroSubtitle = settings?.hero_subtitle ?? "";
  const introText = settings?.intro_text ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero section with gradient overlay */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--theme-sleep)/0.15)] via-transparent to-[hsl(var(--theme-anxiety)/0.1)]" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-[hsl(var(--primary)/0.08)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 bg-[hsl(var(--theme-stress)/0.08)] rounded-full blur-3xl" />

        <main className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
              Helt anonymt
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5 leading-[1.1]">
              {heroTitle.includes("bedre hverdag") ? (
                <>
                  {heroTitle.split("bedre hverdag")[0]}
                  <span className="block bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--theme-sleep))] to-[hsl(var(--theme-anxiety))] bg-clip-text text-transparent">
                    bedre hverdag
                  </span>
                </>
              ) : (
                heroTitle
              )}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[55ch] leading-relaxed">
              {heroSubtitle}
            </p>
          </motion.div>

          {/* Intro text section */}
          {introText && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-14 max-w-3xl"
            >
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-8">
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {introText}
                </p>
              </div>
            </motion.div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 p-8 animate-pulse h-64" />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {themes?.map((theme, i) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ThemeCard theme={theme} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      <HelpButton />
    </div>
  );
};

export default Index;
