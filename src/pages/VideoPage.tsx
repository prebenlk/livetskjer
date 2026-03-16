import { useParams, Link } from "react-router-dom";
import { useTheme, useVideo, useSubmitFeedback } from "@/hooks/use-data";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Frown, Meh, Smile } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const feedbackOptions = [
  { icon: Frown, label: "Ikke nyttig", value: "bad" },
  { icon: Meh, label: "Ok", value: "ok" },
  { icon: Smile, label: "Veldig nyttig", value: "good" },
] as const;

const VideoPage = () => {
  const { themeId, videoId } = useParams();
  const { data: theme } = useTheme(themeId);
  const { data: video, isLoading } = useVideo(videoId);
  const submitFeedback = useSubmitFeedback();
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="aspect-video bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!video || !theme) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-muted-foreground">Video ikke funnet.</p>
        </div>
      </div>
    );
  }

  const handleFeedback = (value: string) => {
    submitFeedback.mutate({ video_id: video.id, rating: value });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link
          to={`/tema/${themeId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til {theme.title}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-semibold text-foreground mb-2">{video.title}</h1>
          <p className="text-muted-foreground mb-8">{video.description}</p>

          <div className="aspect-video rounded-2xl overflow-hidden bg-foreground/5 mb-10">
            <iframe
              src={video.url}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="bg-card rounded-2xl card-shadow border border-border/50 p-8">
            <h3 className="font-medium text-foreground mb-4">
              {submitted ? "Takk for tilbakemeldingen! 🙏" : "Var denne videoen nyttig?"}
            </h3>

            {!submitted ? (
              <div className="flex gap-4">
                {feedbackOptions.map(({ icon: Icon, label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleFeedback(value)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <Icon className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Din tilbakemelding hjelper oss å forbedre innholdet.
              </p>
            )}
          </div>
        </motion.div>
      </main>
      <HelpButton />
    </div>
  );
};

export default VideoPage;
