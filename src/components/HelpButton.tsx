import { Phone } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-0 glass-strong rounded-2xl card-shadow-hover border border-border/30 p-6 w-72"
          >
            <h4 className="font-bold text-foreground mb-3">Trenger du hjelp nå?</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:116123" className="flex items-center gap-2.5 text-primary hover:underline font-medium">
                  <Phone className="w-4 h-4" />
                  Mental Helse: 116 123
                </a>
              </li>
              <li>
                <a href="tel:22400040" className="flex items-center gap-2.5 text-primary hover:underline font-medium">
                  <Phone className="w-4 h-4" />
                  Kirkens SOS: 22 40 00 40
                </a>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">Åpent hele døgnet, helt gratis.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-[hsl(var(--primary)/0.3)] hover:shadow-[hsl(var(--primary)/0.5)] hover:scale-105 transition-all"
        aria-label="Trenger du hjelp?"
      >
        <Phone className="w-5 h-5" />
      </button>
    </div>
  );
}