import { Moon, Heart, Brain, Users, Smile, Shield, Flame, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  themeId: string;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  videoCount: number;
}

export const themes: Theme[] = [
  {
    id: "sovn",
    title: "Søvnvansker",
    description: "Lær teknikker for å finne roen og forbedre søvnkvaliteten din.",
    icon: Moon,
    videoCount: 3,
  },
  {
    id: "angst",
    title: "Angst og uro",
    description: "Verktøy for å håndtere angst og bekymringer i hverdagen.",
    icon: Heart,
    videoCount: 2,
  },
  {
    id: "stress",
    title: "Stress og utbrenthet",
    description: "Finn balanse og lær deg å sette grenser for deg selv.",
    icon: Flame,
    videoCount: 2,
  },
  {
    id: "selvfolelse",
    title: "Selvfølelse",
    description: "Bygg et sterkere forhold til deg selv med enkle øvelser.",
    icon: Shield,
    videoCount: 2,
  },
  {
    id: "relasjoner",
    title: "Relasjoner",
    description: "Forstå dine relasjoner bedre og kommuniser tydeligere.",
    icon: Users,
    videoCount: 2,
  },
  {
    id: "mindfulness",
    title: "Mindfulness",
    description: "Øvelser for å være til stede i øyeblikket og roe ned tankene.",
    icon: Wind,
    videoCount: 2,
  },
];

export const videos: Video[] = [
  { id: "v1", themeId: "sovn", title: "Avspenningsøvelse for bedre søvn", description: "En guidet øvelse som hjelper deg med å slappe av kroppen før du legger deg.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "12:30" },
  { id: "v2", themeId: "sovn", title: "Søvnhygiene – gode vaner", description: "Lær om rutiner som fremmer god søvn.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "8:45" },
  { id: "v3", themeId: "sovn", title: "Pusteøvelser for natten", description: "Enkle pusteteknikker som roer ned nervesystemet.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "6:20" },
  { id: "v4", themeId: "angst", title: "Forstå angsten din", description: "Hva skjer i kroppen når du opplever angst?", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:15" },
  { id: "v5", themeId: "angst", title: "Grounding-teknikk", description: "En enkel øvelse for å komme tilbake til nuet.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "5:40" },
  { id: "v6", themeId: "stress", title: "Sett grenser uten dårlig samvittighet", description: "Lær å si nei på en god måte.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "9:00" },
  { id: "v7", themeId: "stress", title: "Korte pauser i hverdagen", description: "Mikro-pauser som gir stor effekt.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "4:30" },
  { id: "v8", themeId: "selvfolelse", title: "Selvmedfølelse – en introduksjon", description: "Lær å behandle deg selv med vennlighet.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "11:00" },
  { id: "v9", themeId: "selvfolelse", title: "Indre kritiker vs. indre venn", description: "Gjenkjenn og utfordre den indre kritikeren.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "7:50" },
  { id: "v10", themeId: "relasjoner", title: "Aktiv lytting", description: "Bli en bedre lytter i dine relasjoner.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "8:20" },
  { id: "v11", themeId: "relasjoner", title: "Konflikthåndtering", description: "Verktøy for å løse uenigheter konstruktivt.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "10:00" },
  { id: "v12", themeId: "mindfulness", title: "5-minutters mindfulness", description: "En kort guidet meditasjon for travle dager.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "5:00" },
  { id: "v13", themeId: "mindfulness", title: "Kroppsskanning", description: "Bli bevisst på spenninger i kroppen.", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "15:00" },
];
