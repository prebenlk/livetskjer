import { Link, useParams, useNavigate } from "react-router-dom";
import { useThemes, useAllThemeResources } from "@/hooks/use-data";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { getIcon } from "@/lib/icons";
import { motion } from "framer-motion";
import { Wrench, ExternalLink, ChevronRight, ArrowLeft, FileText, Download } from "lucide-react";

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

export function markThemeVisited(themeId: string) {
  try {
    const visited: string[] = JSON.parse(localStorage.getItem("visited_themes") || "[]");
    if (!visited.includes(themeId)) {
      visited.push(themeId);
      localStorage.setItem("visited_themes", JSON.stringify(visited));
    }
  } catch { /* ignore */ }
}

const ToolsPage = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const { data: themes } = useThemes();
  const { data: allResources } = useAllThemeResources();

  const themesWithTools = (themes ?? [])
    .map((theme, idx) => ({
      theme,
      tools: (allResources ?? []).filter((r: any) => r.theme_id === theme.id && r.type === "tool"),
      color: THEME_COLORS[idx % THEME_COLORS.length],
    }))
    .filter((t) => t.tools.length > 0);

  const hasTools = themesWithTools.length > 0;

  // If a themeId is selected, show tools for that theme
  const selectedCategory = themeId
    ? themesWithTools.find((t) => t.theme.id === themeId)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
              Verktøy
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              {hasTools
                ? "Velg en kategori for å utforske verktøy og øvelser."
                : "Ingen verktøy er lagt til ennå. Sjekk tilbake snart!"}
            </p>
          </motion.div>

          {!hasTools && (
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

          {/* Category view - show theme cards */}
          {!selectedCategory && hasTools && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {themesWithTools.map(({ theme, tools, color }, idx) => {
                const Icon = getIcon(theme.icon);
                return (
                  <motion.button
                    key={theme.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 + 0.1, duration: 0.5 }}
                    onClick={() => navigate(`/verktoy/${theme.id}`)}
                    className="glass rounded-2xl border border-border/30 p-8 hover:border-border/60 transition-all hover:card-shadow-hover group text-left cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color.gradient} flex items-center justify-center shadow-lg mb-5`}
                      style={{ boxShadow: `0 4px 20px -4px ${color.accent}40` }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      Verktøy for {theme.title.toLowerCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {theme.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: `${color.accent}18`,
                          color: color.accent,
                        }}
                      >
                        {tools.length} verktøy
                      </span>
                      <ChevronRight
                        className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Detail view - show tools for selected theme */}
          {selectedCategory && (
            <div>
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/verktoy")}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Tilbake til kategorier
              </motion.button>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4 mb-8"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedCategory.color.gradient} flex items-center justify-center shadow-lg`}
                  style={{ boxShadow: `0 4px 20px -4px ${selectedCategory.color.accent}40` }}
                >
                  {(() => {
                    const Icon = getIcon(selectedCategory.theme.icon);
                    return <Icon className="w-7 h-7 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Verktøy for {selectedCategory.theme.title.toLowerCase()}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory.tools.length} verktøy tilgjengelig
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {selectedCategory.tools.map((tool: any, idx: number) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 + 0.15, duration: 0.4 }}
                    className="glass rounded-xl border border-border/30 p-5 hover:border-border/60 transition-all hover:card-shadow-hover group"
                  >
                    {tool.image_url && (
                      <a href={tool.image_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={tool.image_url}
                          alt={tool.title}
                          className="w-full h-40 object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </a>
                    )}
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: selectedCategory.color.accent }} />
                      <h4 className="font-semibold text-foreground">{tool.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 pl-8">{tool.description}</p>
                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline pl-8"
                        style={{ color: selectedCategory.color.accent }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Last ned verktøy
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <HelpButton />
    </div>
  );
};

export default ToolsPage;
