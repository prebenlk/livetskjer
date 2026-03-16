import { themes } from "@/data/themes";
import { ThemeCard } from "@/components/ThemeCard";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Verktøy for en bedre hverdag
          </h1>
          <p className="text-lg text-muted-foreground max-w-[65ch] leading-relaxed">
            Velg et tema som passer din situasjon. Helt anonymt, helt tilgjengelig.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
            >
              <ThemeCard theme={theme} />
            </motion.div>
          ))}
        </motion.div>
      </main>
      <HelpButton />
    </div>
  );
};

export default Index;
