import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import {
  useThemes, useVideos,
  useCreateTheme, useUpdateTheme, useDeleteTheme,
  useCreateVideo, useUpdateVideo, useDeleteVideo,
  useSiteSettings, useUpdateSiteSetting,
} from "@/hooks/use-data";
import { getIcon, iconMap } from "@/lib/icons";
import { Plus, Trash2, Video as VideoIcon, LayoutGrid, LogOut, Pencil, X, Check, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Tab = "themes" | "videos" | "settings";

const ADMIN_EMAIL = "preben-karlsen@hotmail.com";
const ICON_OPTIONS = Object.keys(iconMap);

const AdminPage = () => {
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("themes");
  const { data: themes } = useThemes();
  const { data: videos } = useVideos();

  const createTheme = useCreateTheme();
  const updateTheme = useUpdateTheme();
  const deleteTheme = useDeleteTheme();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();

  // Theme form state
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [newTheme, setNewTheme] = useState({ title: "", description: "", icon: "heart" });
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [editTheme, setEditTheme] = useState({ title: "", description: "", icon: "" });

  // Video form state
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", description: "", url: "", theme_id: "", duration: "" });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideo, setEditVideo] = useState({ title: "", description: "", url: "", theme_id: "", duration: "" });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laster...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Ingen tilgang</h1>
          <p className="text-muted-foreground">Du har ikke admin-tilgang.</p>
          <Link to="/" className="text-primary hover:underline">Gå til forsiden</Link>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: "themes", label: "Temaer", icon: LayoutGrid },
    { id: "videos", label: "Videoer", icon: VideoIcon },
  ];

  // --- Theme handlers ---
  const handleAddTheme = () => {
    if (!newTheme.title) { toast.error("Tittel er påkrevd"); return; }
    createTheme.mutate(newTheme, {
      onSuccess: () => {
        toast.success("Tema opprettet!");
        setShowAddTheme(false);
        setNewTheme({ title: "", description: "", icon: "heart" });
      },
      onError: (e) => toast.error(e.message),
    });
  };

  const startEditTheme = (theme: any) => {
    setEditingThemeId(theme.id);
    setEditTheme({ title: theme.title, description: theme.description, icon: theme.icon });
  };

  const handleSaveTheme = () => {
    if (!editingThemeId) return;
    updateTheme.mutate({ id: editingThemeId, ...editTheme }, {
      onSuccess: () => {
        toast.success("Tema oppdatert!");
        setEditingThemeId(null);
      },
      onError: (e) => toast.error(e.message),
    });
  };

  // --- Video handlers ---
  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url || !newVideo.theme_id) {
      toast.error("Fyll inn alle påkrevde felt");
      return;
    }
    createVideo.mutate(newVideo, {
      onSuccess: () => {
        toast.success("Video lagt til!");
        setShowAddVideo(false);
        setNewVideo({ title: "", description: "", url: "", theme_id: "", duration: "" });
      },
      onError: (e) => toast.error(e.message),
    });
  };

  const startEditVideo = (video: any) => {
    setEditingVideoId(video.id);
    setEditVideo({
      title: video.title,
      description: video.description,
      url: video.url,
      theme_id: video.theme_id,
      duration: video.duration,
    });
  };

  const handleSaveVideo = () => {
    if (!editingVideoId) return;
    updateVideo.mutate({ id: editingVideoId, ...editVideo }, {
      onSuccess: () => {
        toast.success("Video oppdatert!");
        setEditingVideoId(null);
      },
      onError: (e) => toast.error(e.message),
    });
  };

  const inputClass = "rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Adminpanel</h1>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logg ut
          </button>
        </div>

        {/* Tabs */}
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

        {/* ========== THEMES TAB ========== */}
        {tab === "themes" && (
          <div>
            <button
              onClick={() => setShowAddTheme(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity mb-6"
            >
              <Plus className="w-4 h-4" />
              Legg til tema
            </button>

            <AnimatePresence>
              {showAddTheme && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card rounded-2xl card-shadow border border-border/50 p-6 mb-6 overflow-hidden"
                >
                  <h3 className="font-medium text-foreground mb-4">Nytt tema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      placeholder="Tittel"
                      value={newTheme.title}
                      onChange={(e) => setNewTheme({ ...newTheme, title: e.target.value })}
                      className={inputClass}
                    />
                    <select
                      value={newTheme.icon}
                      onChange={(e) => setNewTheme({ ...newTheme, icon: e.target.value })}
                      className={inputClass}
                    >
                      {ICON_OPTIONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder="Beskrivelse"
                      value={newTheme.description}
                      onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                      className={`md:col-span-2 ${inputClass} min-h-[80px]`}
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleAddTheme} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                      Lagre
                    </button>
                    <button onClick={() => setShowAddTheme(false)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors">
                      Avbryt
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-medium text-foreground">Alle temaer ({themes?.length ?? 0})</h2>
              </div>
              <div className="divide-y divide-border">
                {themes?.map((theme) => {
                  const Icon = getIcon(theme.icon);
                  const isEditing = editingThemeId === theme.id;

                  return (
                    <div key={theme.id} className="p-6">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                              value={editTheme.title}
                              onChange={(e) => setEditTheme({ ...editTheme, title: e.target.value })}
                              className={inputClass}
                              placeholder="Tittel"
                            />
                            <select
                              value={editTheme.icon}
                              onChange={(e) => setEditTheme({ ...editTheme, icon: e.target.value })}
                              className={inputClass}
                            >
                              {ICON_OPTIONS.map((icon) => (
                                <option key={icon} value={icon}>{icon}</option>
                              ))}
                            </select>
                            <textarea
                              value={editTheme.description}
                              onChange={(e) => setEditTheme({ ...editTheme, description: e.target.value })}
                              className={`${inputClass} min-h-[60px]`}
                              placeholder="Beskrivelse"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button onClick={handleSaveTheme} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                              <Check className="w-4 h-4" /> Lagre
                            </button>
                            <button onClick={() => setEditingThemeId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">
                              <X className="w-4 h-4" /> Avbryt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon className="text-primary w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{theme.title}</p>
                              <p className="text-sm text-muted-foreground">{theme.description.slice(0, 60)}{theme.description.length > 60 ? '…' : ''} · {theme.videoCount} videoer</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEditTheme(theme)}
                              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                              title="Rediger"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Slette dette temaet og alle tilhørende videoer?")) {
                                  deleteTheme.mutate(theme.id, {
                                    onSuccess: () => toast.success("Tema slettet"),
                                    onError: (e) => toast.error(e.message),
                                  });
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                              title="Slett"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========== VIDEOS TAB ========== */}
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
                    <input placeholder="Tittel *" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} className={inputClass} />
                    <select value={newVideo.theme_id} onChange={(e) => setNewVideo({ ...newVideo, theme_id: e.target.value })} className={inputClass}>
                      <option value="">Velg tema *</option>
                      {themes?.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    <input placeholder="Video-URL (YouTube embed) *" value={newVideo.url} onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })} className={inputClass} />
                    <input placeholder="Varighet (f.eks. 10:30)" value={newVideo.duration} onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })} className={inputClass} />
                    <textarea placeholder="Beskrivelse" value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[80px]`} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleAddVideo} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Lagre</button>
                    <button onClick={() => setShowAddVideo(false)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors">Avbryt</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="font-medium text-foreground">Alle videoer ({videos?.length ?? 0})</h2>
              </div>
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {videos?.map((video) => {
                    const theme = themes?.find((t) => t.id === video.theme_id);
                    const isEditing = editingVideoId === video.id;

                    return (
                      <motion.div key={video.id} layout exit={{ opacity: 0, x: -20 }} className="p-6">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input value={editVideo.title} onChange={(e) => setEditVideo({ ...editVideo, title: e.target.value })} className={inputClass} placeholder="Tittel" />
                              <select value={editVideo.theme_id} onChange={(e) => setEditVideo({ ...editVideo, theme_id: e.target.value })} className={inputClass}>
                                {themes?.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                              </select>
                              <input value={editVideo.url} onChange={(e) => setEditVideo({ ...editVideo, url: e.target.value })} className={inputClass} placeholder="Video-URL" />
                              <input value={editVideo.duration} onChange={(e) => setEditVideo({ ...editVideo, duration: e.target.value })} className={inputClass} placeholder="Varighet" />
                              <textarea value={editVideo.description} onChange={(e) => setEditVideo({ ...editVideo, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[60px]`} placeholder="Beskrivelse" />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={handleSaveVideo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                                <Check className="w-4 h-4" /> Lagre
                              </button>
                              <button onClick={() => setEditingVideoId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">
                                <X className="w-4 h-4" /> Avbryt
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">{video.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {theme?.title ?? "Ukjent tema"} · <span className="tabular-nums">{video.duration}</span>
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEditVideo(video)}
                                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                                title="Rediger"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Slette denne videoen?")) {
                                    deleteVideo.mutate(video.id, {
                                      onSuccess: () => toast.success("Video slettet"),
                                      onError: (e) => toast.error(e.message),
                                    });
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                title="Slett"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
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
