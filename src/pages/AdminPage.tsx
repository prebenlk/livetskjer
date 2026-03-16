import { useState } from "react";
import { Header } from "@/components/Header";
import { themes as initialThemes, videos as initialVideos, type Theme, type Video } from "@/data/themes";
import { Plus, Pencil, Trash2, Video as VideoIcon, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "themes" | "videos";

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>("themes");
  const [themeList] = useState<Theme[]>(initialThemes);
  const [videoList] = useState<Video[]>(initialVideos);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", description: "", url: "", themeId: "", duration: "" });

  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: "themes", label: "Temaer", icon: LayoutGrid },
    { id: "videos", label: "Videoer", icon: VideoIcon },
  ];

  const handleAddVideo = () => {
    // In the future, save to database
    setShowAddVideo(false);
    setNewVideo({ title: "", description: "", url: "", themeId: "", duration: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-foreground mb-8">Adminpanel</h1>

        <div className="flex gap-2 mb-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === "themes" && (
          <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-medium text-foreground">Alle temaer</h2>
            </div>
            <div className="divide-y divide-border">
              {themeList.map((theme) => {
                const Icon = theme.icon;
                return (
                  <div key={theme.id} className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="text-primary w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{theme.title}</p>
                        <p className="text-sm text-muted-foreground">{theme.videoCount} videoer</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "videos" && (
          <div>
            <button
              onClick={() => setShowAddVideo(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mb-6"
            >
              <Plus className="w-4 h-4" />
              Legg til video
            </button>

            <AnimatePresence>
              {showAddVideo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card rounded-2xl card-shadow border border-border/50 p-6 mb-6 overflow-hidden"
                >
                  <h3 className="font-medium text-foreground mb-4">Ny video</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      placeholder="Tittel"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <select
                      value={newVideo.themeId}
                      onChange={(e) => setNewVideo({ ...newVideo, themeId: e.target.value })}
                      className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Velg tema</option>
                      {themeList.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                    <input
                      placeholder="Video-URL (YouTube embed)"
                      value={newVideo.url}
                      onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                      className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      placeholder="Varighet (f.eks. 10:30)"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      className="rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <textarea
                      placeholder="Beskrivelse"
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      className="md:col-span-2 rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleAddVideo}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Lagre
                    </button>
                    <button
                      onClick={() => setShowAddVideo(false)}
                      className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Avbryt
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-medium text-foreground">Alle videoer</h2>
              </div>
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {videoList.map((video) => {
                    const theme = themeList.find((t) => t.id === video.themeId);
                    return (
                      <motion.div
                        key={video.id}
                        layout
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-6"
                      >
                        <div>
                          <p className="font-medium text-foreground">{video.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {theme?.title} · <span className="tabular-nums">{video.duration}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
