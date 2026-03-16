import { useState } from "react";
import { useThemes, useSiteSettings } from "@/hooks/use-data";
import { ThemeCard } from "@/components/ThemeCard";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Activity, BookOpen, Users, Heart, ChevronDown, ExternalLink } from "lucide-react";
import treeOfLife from "@/assets/tree-of-life.png";

const FIVE_TIPS = [
  {
    icon: Eye,
    title: "Vær oppmerksom",
    short: "Vær til stede i øyeblikket og legg merke til det som skjer rundt deg.",
    detail: "Det å være til stede i øyeblikket kan være en viktig kilde til livskvalitet. Bruk sansene og legg merke til omgivelsene – løvet som skifter farge, lyden av fuglekvitter, smaken av et saftig eple. Oppmerksomhet reduserer stress, gir større ro, bedrer konsentrasjon og øker glede og tilfredshet.",
    color: "hsl(275, 55%, 62%)",
  },
  {
    icon: Activity,
    title: "Vær aktiv",
    short: "Beveg deg, få opp pulsen og bruk kroppen – velg noe du liker.",
    detail: "Fysisk aktivitet bedrer både psykisk og fysisk helse, og øker tilfredsheten med livet. Det kan styrke selvfølelsen, hjelpe med å takle stress og bidra til bedre søvn og hukommelse. Velg noe du liker – gå en tur, dans, svøm eller gjør yoga. Noen få minutter kan løfte humøret.",
    color: "hsl(168, 55%, 48%)",
  },
  {
    icon: BookOpen,
    title: "Fortsett å lære",
    short: "Utforsk nysgjerrigheten din og prøv noe nytt.",
    detail: "Å fortsette å lære gir opplevelse av kompetanse og selvtillit, og øker tilfredsheten med livet. Prøv noe nytt, fordyp deg i en hobby, eller utforsk ukjent terreng. Bare det å oppleve variasjon i omgivelsene gjør oss gladere. Å gå helt opp i en oppgave gir opplevelse av glede og mening.",
    color: "hsl(200, 65%, 55%)",
  },
  {
    icon: Users,
    title: "Knytt bånd",
    short: "Plei relasjonene dine og skap nye forbindelser.",
    detail: "Vi mennesker har grunnleggende behov for å høre til. Plei relasjonene du har og etabler nye. Både nære, gode relasjoner og løsere bånd med mennesker du møter i hverdagen er viktig. Gode relasjoner gir bedre psykisk og fysisk helse, og kan til og med bidra til et lengre liv.",
    color: "hsl(45, 70%, 55%)",
  },
  {
    icon: Heart,
    title: "Gi",
    short: "Bidra, del og vær sjenerøs – det gir glede til begge parter.",
    detail: "Å hjelpe, støtte og bidra er ikke bare godt for den som mottar – det gjør også godt for den som gir. Engasjer deg i en forening, hjelp en venn, eller støtt noen som har det vanskelig. Å gi styrker båndene mellom mennesker og gir opplevelse av mening og glede.",
    color: "hsl(340, 65%, 58%)",
  },
];

const Index = () => {
  const { data: themes, isLoading } = useThemes();
  const { data: settings } = useSiteSettings();

  const heroTitle = settings?.hero_title ?? "Verktøy for en bedre hverdag";
  const heroSubtitle = settings?.hero_subtitle ?? "";
  const introText = settings?.intro_text ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero section */}
      <div className="relative overflow-hidden noise">
        {/* Ambient gradient blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[hsl(var(--primary)/0.06)] rounded-full blur-[120px]" />
          <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-[hsl(var(--theme-sleep)/0.06)] rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-[hsl(var(--theme-anxiety)/0.04)] rounded-full blur-[80px]" />
        </div>

        <main className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-20 text-center mx-auto max-w-3xl"
          >
            {/* Brand title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 flex items-center justify-center gap-4 md:gap-6"
            >
              {/* Tree of Life icon */}
              <div className="relative shrink-0">
                <img src={treeOfLife} alt="Tree of Life" className="w-14 h-14 md:w-20 md:h-20 relative z-10" />
                <div className="absolute inset-0 blur-2xl bg-[hsl(var(--primary)/0.2)] rounded-full scale-150" />
              </div>
              <div className="leading-none" style={{ fontFamily: "'Great Vibes', cursive" }}>
                <span className="text-5xl md:text-7xl lg:text-8xl text-gradient bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(168,65%,60%)] to-[hsl(var(--theme-sleep))]">
                  Livet skjer
                </span>
              </div>
            </motion.div>
            <div className="mb-10 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.08]">
              {heroTitle.includes("bedre hverdag") ? (
                <>
                  {heroTitle.split("bedre hverdag")[0]}
                  <span className="block mt-2 text-gradient bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(168,65%,60%)] to-[hsl(var(--theme-sleep))]">
                    bedre hverdag
                  </span>
                </>
              ) : (
                heroTitle
              )}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base md:text-lg text-muted-foreground max-w-[52ch] mx-auto leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>
          </motion.div>

          {/* Intro text */}
          {introText && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mb-16 max-w-3xl mx-auto"
            >
              <div className="glass rounded-2xl border border-border/40 p-8 md:p-10">
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg text-center">
                  {introText}
                </p>
              </div>
            </motion.div>
          )}

          {/* Section divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-4 mb-10 max-w-3xl mx-auto"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/60" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Utforsk temaer
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/60" />
          </motion.div>

          {/* Theme cards grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 rounded-2xl border border-border/30 p-8 animate-pulse h-64"
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {themes?.map((theme, i) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 * i + 0.4,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ThemeCard theme={theme} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/20 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Livetskjer.no — Anonymt og gratis
          </p>
          <p className="text-xs text-muted-foreground/60">
            Et verktøy for psykisk helse og mestring
          </p>
        </div>
      </footer>

      <HelpButton />
    </div>
  );
};

export default Index;