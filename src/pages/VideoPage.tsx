import { useParams, Link } from "react-router-dom";
import { useTheme, useVideo, useSubmitFeedback } from "@/hooks/use-data";
import { Header } from "@/components/Header";
import { HelpButton } from "@/components/HelpButton";
import { ArrowLeft, Frown, Meh, Smile, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toYouTubeEmbedUrl } from "@/lib/utils";

const feedbackOptions = [
  {
    icon: Frown,
    label: "Ikke nyttig",
    value: "negative",
    color: "hsl(0, 70%, 60%)",
    question: "Hva var ikke bra?",
  },
  {
    icon: Meh,
    label: "Ok",
    value: "neutral",
    color: "hsl(40, 70%, 55%)",
    question: "Hva kunne vært gjort bedre?",
  },
  {
    icon: Smile,
    label: "Veldig nyttig",
    value: "positive",
    color: "hsl(168, 50%, 50%)",
    question: "Hva var bra?",
  },
] as const;

const VideoPage = () => {
  const { themeId, videoId } = useParams();
  const { data: theme } = useTheme(themeId);
  const { data: video, isLoading } = useVideo(videoId);
  const submitFeedback = useSubmitFeedback();
  const [submitted, setSubmitted] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [comment, setComment] = useState("");

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

  const selectedOption = feedbackOptions.find((o) => o.value === selectedRating);

  const handleSelectRating = (value: string) => {
    setSelectedRating(value);
  };

  const handleSubmit = () => {
    if (!selectedRating) return;
    submitFeedback.mutate({
      video_id: video.id,
      rating: selectedRating,
      comment: comment.trim() || undefined,
    });
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{video.title}</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">{video.description}</p>

          <div className="aspect-video rounded-2xl overflow-hidden bg-card border border-border/50 card-shadow mb-10">
            <iframe
              src={toYouTubeEmbedUrl(video.url)}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="bg-card rounded-2xl card-shadow border border-border/50 p-8">
            <h3 className="font-semibold text-foreground mb-5">
              {submitted ? "Takk for tilbakemeldingen! 🙏" : "Var denne videoen nyttig?"}
            </h3>

            {!submitted ? (
              <div className="space-y-5">
                {/* Rating buttons */}
                <div className="flex gap-4">
                  {feedbackOptions.map(({ icon: Icon, label, value, color }) => (
                    <button
                      key={value}
                      onClick={() => handleSelectRating(value)}
                      className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all bg-background ${
                        selectedRating === value
                          ? "border-primary ring-2 ring-primary/20 scale-105"
                          : "border-border/50 hover:border-border hover:card-shadow-hover"
                      }`}
                    >
                      <Icon className="w-7 h-7" style={{ color }} />
                      <span className="text-xs text-muted-foreground font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Comment box appears after selecting a rating */}
                <AnimatePresence>
                  {selectedRating && selectedOption && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="text-sm font-medium text-foreground block mb-2">
                        {selectedOption.question}
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Skriv din tilbakemelding her (valgfritt)..."
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground min-h-[100px] resize-none"
                      />
                      <button
                        onClick={handleSubmit}
                        className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <Send className="w-4 h-4" />
                        Send tilbakemelding
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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