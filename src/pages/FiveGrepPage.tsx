import { useState } from "react";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { useSiteSettings } from "@/hooks/use-data";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Activity, BookOpen, Users, Heart, ChevronDown, ExternalLink, Sparkles, Star, Sun, Zap, Shield } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  eye: Eye, activity: Activity, "book-open": BookOpen, users: Users, heart: Heart,
  sparkles: Sparkles, star: Star, sun: Sun, zap: Zap, shield: Shield,
};

const DEFAULT_TIPS = [
  { title: "Vær oppmerksom", short: "Vær til stede i øyeblikket og legg merke til det som skjer rundt deg.", detail: "Det å være til stede i øyeblikket kan være en viktig kilde til livskvalitet. Bruk sansene og legg merke til omgivelsene – løvet som skifter farge, lyden av fuglekvitter, smaken av et saftig eple. Oppmerksomhet reduserer stress, gir større ro, bedrer konsentrasjon og øker glede og tilfredshet.", icon: "eye", color: "hsl(275, 55%, 62%)" },
  { title: "Vær aktiv", short: "Beveg deg, få opp pulsen og bruk kroppen – velg noe du liker.", detail: "Fysisk aktivitet bedrer både psykisk og fysisk helse, og øker tilfredsheten med livet. Det kan styrke selvfølelsen, hjelpe med å takle stress og bidra til bedre søvn og hukommelse. Velg noe du liker – gå en tur, dans, svøm eller gjør yoga. Noen få minutter kan løfte humøret.", icon: "activity", color: "hsl(168, 55%, 48%)" },
  { title: "Fortsett å lære", short: "Utforsk nysgjerrigheten din og prøv noe nytt.", detail: "Å fortsette å lære gir opplevelse av kompetanse og selvtillit, og øker tilfredsheten med livet. Prøv noe nytt, fordyp deg i en hobby, eller utforsk ukjent terreng. Bare det å oppleve variasjon i omgivelsene gjør oss gladere. Å gå helt opp i en oppgave gir opplevelse av glede og mening.", icon: "book-open", color: "hsl(200, 65%, 55%)" },
  { title: "Knytt bånd", short: "Plei relasjonene dine og skap nye forbindelser.", detail: "Vi mennesker har grunnleggende behov for å høre til. Plei relasjonene du har og etabler nye. Både nære, gode relasjoner og løsere bånd med mennesker du møter i hverdagen er viktig. Gode relasjoner gir bedre psykisk og fysisk helse, og kan til og med bidra til et lengre liv.", icon: "users", color: "hsl(45, 70%, 55%)" },
  { title: "Gi", short: "Bidra, del og vær sjenerøs – det gir glede til begge parter.", detail: "Å hjelpe, støtte og bidra er ikke bare godt for den som mottar – det gjør også godt for den som gir. Engasjer deg i en forening, hjelp en venn, eller støtt noen som har det vanskelig. Å gi styrker båndene mellom mennesker og gir opplevelse av mening og glede.", icon: "heart", color: "hsl(340, 65%, 58%)" },
];

interface Tip {
  title: string;
  short: string;
  detail: string;
  icon: string;
  color: string;
}

function TipCard({ tip, index }: { tip: Tip; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = ICON_MAP[tip.icon] || Eye;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 + 0.15, duration: 0.4 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full glass rounded-xl border border-border/30 hover:border-border/50 transition-all p-5 md:p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${tip.color}20`, color: tip.color }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-base md:text-lg">{tip.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{tip.short}</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mt-4 pl-16 pr-2">
                {tip.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
}

const FiveGrepPage = () => {
  const { data: settings } = useSiteSettings();

  let tips: Tip[] = DEFAULT_TIPS;
  if (settings?.five_tips) {
    try { tips = JSON.parse(settings.five_tips); } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="relative overflow-hidden noise">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[hsl(var(--primary)/0.06)] rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-[hsl(var(--theme-anxiety)/0.05)] rounded-full blur-[100px]" />
        </div>

        <main className="relative max-w-3xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(275,55%,62%)] to-[hsl(340,65%,58%)] mb-6 shadow-lg shadow-[hsl(275,55%,62%,0.3)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              5 grep for hverdagsglede
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Kunnskapsbaserte aktiviteter alle kan gjøre for å fremme livskvalitet og helse, uavhengig av alder og livssituasjon.
            </p>
          </motion.div>

          <div className="space-y-3">
            {tips.map((tip, i) => (
              <TipCard key={i} tip={tip} index={i} />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground/70 text-center mt-10"
          >
            Kilde:{" "}
            <a
              href="https://www.fhi.no/ps/livskvalitet-og-trivsel/hverdagsgledens-fem-kunnskapsbaserte-grep-for-god-livskvalitet/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
            >
              Folkehelseinstituttet (FHI) – Hverdagsgleden
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.p>
        </main>
      </div>

      <HelpButton />
    </div>
  );
};

export default FiveGrepPage;
