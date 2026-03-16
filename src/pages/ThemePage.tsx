import { useParams, Link } from "react-router-dom";
import { themes, videos } from "@/data/themes";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Play, Clock } from "lucide-react";
import { motion } from "framer-motion";

const ThemePage = () => {
  const { themeId } = useParams();
  const theme = themes.find((t) => t.id === themeId);
  const themeVideos = videos.filter((v) => v.themeId === themeId);

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

  const Icon = theme.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-10">
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
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="text-primary w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{theme.title}</h1>
            <p className="text-muted-foreground mt-1">{theme.description}</p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {themeVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/tema/${themeId}/video/${video.id}`}>
                <div className="bg-card rounded-2xl card-shadow border border-border/50 p-6 hover:card-shadow-hover transition-shadow group cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{video.description}</p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {video.duration}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Play className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
      <HelpButton />
    </div>
  );
};

export default ThemePage;
