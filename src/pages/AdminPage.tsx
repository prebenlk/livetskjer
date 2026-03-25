import { useState, useMemo, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";
import {
  useThemes, useVideos,
  useCreateTheme, useUpdateTheme, useDeleteTheme,
  useCreateVideo, useUpdateVideo, useDeleteVideo,
  useSiteSettings, useUpdateSiteSetting,
  useFeedback, usePageViews,
  useAllThemeResources, useCreateThemeResource, useUpdateThemeResource, useDeleteThemeResource, useUploadResourceImage,
  useSwapThemeOrder, useSwapVideoOrder, useSwapResourceOrder,
} from "@/hooks/use-data";
import { getIcon, iconMap } from "@/lib/icons";
import { Plus, Trash2, Video as VideoIcon, LayoutGrid, LogOut, Pencil, X, Check, Settings, BarChart3, Frown, Meh, Smile, Eye, MessageSquare, TrendingUp, ChevronDown, ChevronRight, BookOpen, Image, ExternalLink, Upload, Navigation, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { SortButtons } from "@/components/admin/SortButtons";
import { NavigationEditor } from "@/components/admin/NavigationEditor";
import { FiveTipsEditor } from "@/components/admin/FiveTipsEditor";

type Tab = "themes" | "settings" | "stats" | "navigation" | "five_tips";

const ADMIN_EMAIL = "preben-karlsen@hotmail.com";
const ICON_OPTIONS = Object.keys(iconMap);

// ========== STATS TAB COMPONENT ==========
const RATING_EMOJI: Record<string, { icon: typeof Smile; label: string; color: string }> = {
  good: { icon: Smile, label: "Positiv", color: "text-green-500" },
  ok: { icon: Meh, label: "Nøytral", color: "text-yellow-500" },
  bad: { icon: Frown, label: "Negativ", color: "text-red-500" },
};

function StatsTab({ themes, videos, feedback, pageViews }: {
  themes: any[] | undefined;
  videos: any[] | undefined;
  feedback: any[] | undefined;
  pageViews: any[] | undefined;
}) {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

  const viewsToday = useMemo(() => pageViews?.filter((v: any) => new Date(v.created_at) >= daysAgo(1)).length ?? 0, [pageViews]);
  const views7d = useMemo(() => pageViews?.filter((v: any) => new Date(v.created_at) >= daysAgo(7)).length ?? 0, [pageViews]);
  const views30d = useMemo(() => pageViews?.filter((v: any) => new Date(v.created_at) >= daysAgo(30)).length ?? 0, [pageViews]);

  const feedbackCount = feedback?.length ?? 0;
  const ratingCounts = useMemo(() => {
    const counts: Record<string, number> = { good: 0, ok: 0, bad: 0 };
    feedback?.forEach((f: any) => { if (counts[f.rating] !== undefined) counts[f.rating]++; });
    return counts;
  }, [feedback]);

  const feedbackByVideo = useMemo(() => {
    const map: Record<string, { title: string; count: number; good: number; ok: number; bad: number }> = {};
    feedback?.forEach((f: any) => {
      if (!map[f.video_id]) {
        const video = videos?.find((v: any) => v.id === f.video_id);
        map[f.video_id] = { title: video?.title ?? "Ukjent video", count: 0, good: 0, ok: 0, bad: 0 };
      }
      map[f.video_id].count++;
      if (f.rating in map[f.video_id]) (map[f.video_id] as any)[f.rating]++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [feedback, videos]);

  const topPages = useMemo(() => {
    const map: Record<string, number> = {};
    pageViews?.forEach((v: any) => { map[v.page] = (map[v.page] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [pageViews]);

  const statCard = (icon: typeof Eye, label: string, value: number | string, sub?: string) => (
    <div className="bg-card rounded-2xl card-shadow border border-border/50 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {(() => { const I = icon; return <I className="w-5 h-5 text-primary" />; })()}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCard(Eye, "Visninger i dag", viewsToday)}
        {statCard(TrendingUp, "Visninger 7d", views7d, `${views30d} siste 30d`)}
        {statCard(LayoutGrid, "Temaer", themes?.length ?? 0)}
        {statCard(VideoIcon, "Videoer", videos?.length ?? 0)}
      </div>

      <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Tilbakemeldinger ({feedbackCount})
          </h2>
        </div>
        <div className="p-6">
          <div className="flex gap-6 mb-6">
            {Object.entries(RATING_EMOJI).map(([key, { icon: RIcon, label, color }]) => (
              <div key={key} className="flex items-center gap-2">
                <RIcon className={`w-5 h-5 ${color}`} />
                <span className="text-sm text-muted-foreground">{label}:</span>
                <span className="font-bold text-foreground tabular-nums">{ratingCounts[key]}</span>
              </div>
            ))}
          </div>
          {feedbackByVideo.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Per video</h3>
              <div className="space-y-2">
                {feedbackByVideo.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground truncate mr-4">{item.title}</span>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-green-500 tabular-nums">{item.good} 😊</span>
                      <span className="text-xs text-yellow-500 tabular-nums">{item.ok} 😐</span>
                      <span className="text-xs text-red-500 tabular-nums">{item.bad} 😟</span>
                      <span className="text-xs font-medium text-muted-foreground tabular-nums">({item.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <Eye className="w-4 h-4" /> Mest besøkte sider
          </h2>
        </div>
        <div className="divide-y divide-border">
          {topPages.map(([page, count]) => (
            <div key={page} className="px-6 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground font-mono">{page}</span>
              <span className="text-sm font-medium text-muted-foreground tabular-nums">{count} visninger</span>
            </div>
          ))}
          {topPages.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">Ingen sidevisninger registrert ennå.</div>
          )}
        </div>
      </div>

      {feedback && feedback.filter((f: any) => f.comment).length > 0 && (
        <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-medium text-foreground">Siste kommentarer</h2>
          </div>
          <div className="divide-y divide-border">
            {feedback.filter((f: any) => f.comment).slice(0, 20).map((f: any) => {
              const video = videos?.find((v: any) => v.id === f.video_id);
              const rInfo = RATING_EMOJI[f.rating];
              const RIcon = rInfo?.icon ?? Meh;
              return (
                <div key={f.id} className="p-4 flex gap-3">
                  <RIcon className={`w-5 h-5 shrink-0 mt-0.5 ${rInfo?.color ?? "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm text-foreground">{f.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {video?.title ?? "Ukjent video"} · {new Date(f.created_at).toLocaleDateString("nb-NO")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== THEME DETAIL COMPONENT ==========
function ThemeDetail({
  theme,
  themeIndex,
  totalThemes,
  videos,
  themes,
  resources,
  onUpdateTheme,
  onDeleteTheme,
  onCreateVideo,
  onUpdateVideo,
  onDeleteVideo,
  onCreateResource,
  onUpdateResource,
  onDeleteResource,
  onUploadImage,
  onSwapThemeOrder,
  onSwapVideoOrder,
  onSwapResourceOrder,
}: {
  theme: any;
  themeIndex: number;
  totalThemes: number;
  videos: any[];
  themes: any[];
  resources: any[];
  onUpdateTheme: any;
  onDeleteTheme: any;
  onCreateVideo: any;
  onUpdateVideo: any;
  onDeleteVideo: any;
  onCreateResource: any;
  onUpdateResource: any;
  onDeleteResource: any;
  onUploadImage: any;
  onSwapThemeOrder: any;
  onSwapVideoOrder: any;
  onSwapResourceOrder: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", icon: "", intro_text: "" });
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", description: "", url: "", duration: "" });
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editVideoForm, setEditVideoForm] = useState({ title: "", description: "", url: "", duration: "" });

  // Resource state
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", description: "", type: "book", link: "", image_url: "" });
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editResourceForm, setEditResourceForm] = useState({ title: "", description: "", type: "book", link: "", image_url: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const themeVideos = videos.filter((v) => v.theme_id === theme.id);
  const themeResources = resources.filter((r: any) => r.theme_id === theme.id);
  const Icon = getIcon(theme.icon);
  const inputClass = "rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground w-full";

  const RESOURCE_TYPES = [
    { value: "book", label: "Bok" },
    { value: "podcast", label: "Podcast" },
    { value: "article", label: "Artikkel" },
    { value: "tool", label: "Verktøy" },
    { value: "other", label: "Annet" },
  ];

  const startEditTheme = () => {
    setEditForm({ title: theme.title, description: theme.description, icon: theme.icon, intro_text: theme.intro_text || "" });
    setIsEditingTheme(true);
  };

  const saveTheme = () => {
    onUpdateTheme.mutate({ id: theme.id, ...editForm }, {
      onSuccess: () => { toast.success("Tema oppdatert!"); setIsEditingTheme(false); },
      onError: (e: any) => toast.error(e.message),
    });
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.url) { toast.error("Tittel og URL er påkrevd"); return; }
    onCreateVideo.mutate({ ...newVideo, theme_id: theme.id }, {
      onSuccess: () => {
        toast.success("Video lagt til!");
        setShowAddVideo(false);
        setNewVideo({ title: "", description: "", url: "", duration: "" });
      },
      onError: (e: any) => toast.error(e.message),
    });
  };

  const startEditVideo = (video: any) => {
    setEditingVideoId(video.id);
    setEditVideoForm({ title: video.title, description: video.description, url: video.url, duration: video.duration });
  };

  const saveVideo = () => {
    if (!editingVideoId) return;
    onUpdateVideo.mutate({ id: editingVideoId, ...editVideoForm }, {
      onSuccess: () => { toast.success("Video oppdatert!"); setEditingVideoId(null); },
      onError: (e: any) => toast.error(e.message),
    });
  };

  const handleImageUpload = async (file: File, target: "new" | "edit") => {
    setUploadingImage(true);
    try {
      const url = await onUploadImage.mutateAsync(file);
      if (target === "new") {
        setNewResource({ ...newResource, image_url: url });
      } else {
        setEditResourceForm({ ...editResourceForm, image_url: url });
      }
      toast.success("Bilde lastet opp!");
    } catch (e: any) {
      toast.error("Feil ved opplasting: " + e.message);
    }
    setUploadingImage(false);
  };

  const addResource = () => {
    if (!newResource.title) { toast.error("Tittel er påkrevd"); return; }
    onCreateResource.mutate({ ...newResource, theme_id: theme.id }, {
      onSuccess: () => {
        toast.success("Ressurs lagt til!");
        setShowAddResource(false);
        setNewResource({ title: "", description: "", type: "book", link: "", image_url: "" });
      },
      onError: (e: any) => toast.error(e.message),
    });
  };

  const startEditResource = (resource: any) => {
    setEditingResourceId(resource.id);
    setEditResourceForm({ title: resource.title, description: resource.description, type: resource.type, link: resource.link || "", image_url: resource.image_url || "" });
  };

  const saveResource = () => {
    if (!editingResourceId) return;
    onUpdateResource.mutate({ id: editingResourceId, ...editResourceForm }, {
      onSuccess: () => { toast.success("Ressurs oppdatert!"); setEditingResourceId(null); },
      onError: (e: any) => toast.error(e.message),
    });
  };

  const swapThemeWithNeighbor = (direction: -1 | 1) => {
    const sorted = themes.filter(t => true).sort((a: any, b: any) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((t: any) => t.id === theme.id);
    const target = idx + direction;
    if (target < 0 || target >= sorted.length) return;
    onSwapThemeOrder.mutate({
      id1: theme.id, order1: theme.sort_order,
      id2: sorted[target].id, order2: sorted[target].sort_order,
    });
  };

  const swapVideoWithNeighbor = (video: any, direction: -1 | 1) => {
    const sorted = themeVideos.sort((a: any, b: any) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((v: any) => v.id === video.id);
    const target = idx + direction;
    if (target < 0 || target >= sorted.length) return;
    onSwapVideoOrder.mutate({
      id1: video.id, order1: video.sort_order,
      id2: sorted[target].id, order2: sorted[target].sort_order,
    });
  };

  const swapResourceWithNeighbor = (resource: any, direction: -1 | 1) => {
    const sorted = themeResources.sort((a: any, b: any) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((r: any) => r.id === resource.id);
    const target = idx + direction;
    if (target < 0 || target >= sorted.length) return;
    onSwapResourceOrder.mutate({
      id1: resource.id, order1: resource.sort_order,
      id2: sorted[target].id, order2: sorted[target].sort_order,
    });
  };

  return (
    <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
      <div className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          <SortButtons
            onMoveUp={() => swapThemeWithNeighbor(-1)}
            onMoveDown={() => swapThemeWithNeighbor(1)}
            isFirst={themeIndex === 0}
            isLast={themeIndex === totalThemes - 1}
          />
          <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-4 text-left">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="text-primary w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-base">{theme.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {theme.description.slice(0, 80)}{theme.description.length > 80 ? '…' : ''}
              </p>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={`/tema/${theme.id}`}
            className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            title="Se temaside"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4" />
          </Link>
          <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-3 py-1">
            {themeVideos.length} videoer · {themeResources.length} ressurser
          </span>
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {/* Theme edit section */}
              <div className="p-6 bg-muted/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Tema-innstillinger</h3>
                  <div className="flex gap-2">
                    {!isEditingTheme && (
                      <button onClick={startEditTheme} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors">
                        <Pencil className="w-3.5 h-3.5" /> Rediger
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Slette dette temaet og alle tilhørende videoer?")) {
                          onDeleteTheme.mutate(theme.id, {
                            onSuccess: () => toast.success("Tema slettet"),
                            onError: (e: any) => toast.error(e.message),
                          });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Slett tema
                    </button>
                  </div>
                </div>

                {isEditingTheme ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={inputClass} placeholder="Tittel" />
                      <select value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} className={inputClass}>
                        {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                      </select>
                    </div>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className={`${inputClass} min-h-[80px]`}
                      placeholder="Kort beskrivelse (vises på kortet)"
                    />
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Introduksjonstekst</label>
                      <textarea
                        value={editForm.intro_text}
                        onChange={(e) => setEditForm({ ...editForm, intro_text: e.target.value })}
                        className={`${inputClass} min-h-[150px]`}
                        placeholder="Skriv en lengre introduksjonstekst som vises på temasiden (f.eks. hva er depresjon, hvordan påvirker det oss...)"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveTheme} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                        <Check className="w-4 h-4" /> Lagre
                      </button>
                      <button onClick={() => setIsEditingTheme(false)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">
                        <X className="w-4 h-4" /> Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground leading-relaxed">{theme.description}</div>
                )}
              </div>

              {/* Videos section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Videoer ({themeVideos.length})
                  </h3>
                  <button
                    onClick={() => setShowAddVideo(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" /> Legg til video
                  </button>
                </div>

                <AnimatePresence>
                  {showAddVideo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-5 rounded-xl bg-muted/40 border border-border/50 overflow-hidden"
                    >
                      <h4 className="text-sm font-medium text-foreground mb-3">Ny video i «{theme.title}»</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input placeholder="Tittel *" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} className={inputClass} />
                        <input placeholder="Varighet (f.eks. 10:30)" value={newVideo.duration} onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })} className={inputClass} />
                        <input placeholder="Video-URL (YouTube embed) *" value={newVideo.url} onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })} className={`md:col-span-2 ${inputClass}`} />
                        <textarea placeholder="Beskrivelse" value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[80px]`} />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={addVideo} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Lagre</button>
                        <button onClick={() => setShowAddVideo(false)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">Avbryt</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {themeVideos.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Ingen videoer lagt til ennå.</p>
                ) : (
                  <div className="space-y-2">
                    {themeVideos.map((video) => {
                      const isEditing = editingVideoId === video.id;
                      return (
                        <div key={video.id} className="rounded-xl border border-border/50 bg-background p-4">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input value={editVideoForm.title} onChange={(e) => setEditVideoForm({ ...editVideoForm, title: e.target.value })} className={inputClass} placeholder="Tittel" />
                                <input value={editVideoForm.duration} onChange={(e) => setEditVideoForm({ ...editVideoForm, duration: e.target.value })} className={inputClass} placeholder="Varighet" />
                                <input value={editVideoForm.url} onChange={(e) => setEditVideoForm({ ...editVideoForm, url: e.target.value })} className={`md:col-span-2 ${inputClass}`} placeholder="Video-URL" />
                                <textarea value={editVideoForm.description} onChange={(e) => setEditVideoForm({ ...editVideoForm, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[60px]`} placeholder="Beskrivelse" />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={saveVideo} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                                  <Check className="w-3.5 h-3.5" /> Lagre
                                </button>
                                <button onClick={() => setEditingVideoId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">
                                  <X className="w-3.5 h-3.5" /> Avbryt
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <SortButtons
                                  onMoveUp={() => swapVideoWithNeighbor(video, -1)}
                                  onMoveDown={() => swapVideoWithNeighbor(video, 1)}
                                  isFirst={themeVideos.indexOf(video) === 0}
                                  isLast={themeVideos.indexOf(video) === themeVideos.length - 1}
                                />
                                <VideoIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="font-medium text-foreground text-sm">{video.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{video.duration}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Link to={`/tema/${theme.id}/video/${video.id}`} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Se video">
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                                <button onClick={() => startEditVideo(video)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Rediger">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Slette denne videoen?")) {
                                      onDeleteVideo.mutate(video.id, {
                                        onSuccess: () => toast.success("Video slettet"),
                                        onError: (e: any) => toast.error(e.message),
                                      });
                                    }
                                  }}
                                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                  title="Slett"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ========== RESOURCES SECTION ========== */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    Ressurser ({themeResources.length})
                  </h3>
                  <button
                    onClick={() => setShowAddResource(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" /> Legg til ressurs
                  </button>
                </div>

                {/* Add resource form */}
                <AnimatePresence>
                  {showAddResource && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-5 rounded-xl bg-muted/40 border border-border/50 overflow-hidden"
                    >
                      <h4 className="text-sm font-medium text-foreground mb-3">Ny ressurs i «{theme.title}»</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input placeholder="Tittel *" value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} className={inputClass} />
                        <select value={newResource.type} onChange={(e) => setNewResource({ ...newResource, type: e.target.value })} className={inputClass}>
                          {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        <input placeholder="Lenke (valgfritt)" value={newResource.link} onChange={(e) => setNewResource({ ...newResource, link: e.target.value })} className={inputClass} />
                        <div className="flex items-center gap-2">
                          <input
                            placeholder="Bilde-URL (valgfritt)"
                            value={newResource.image_url}
                            onChange={(e) => setNewResource({ ...newResource, image_url: e.target.value })}
                            className={inputClass}
                          />
                          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, "new");
                          }} />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="shrink-0 p-3 rounded-xl border border-input bg-background hover:bg-accent transition-colors text-muted-foreground"
                            title="Last opp bilde"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea placeholder="Beskrivelse" value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[80px]`} />
                      </div>
                      {newResource.image_url && (
                        <div className="mt-3">
                          <img src={newResource.image_url} alt="Preview" className="w-20 h-28 object-cover rounded-lg border border-border" />
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button onClick={addResource} disabled={uploadingImage} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                          {uploadingImage ? "Laster opp..." : "Lagre"}
                        </button>
                        <button onClick={() => { setShowAddResource(false); setNewResource({ title: "", description: "", type: "book", link: "", image_url: "" }); }} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">Avbryt</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resource list */}
                {themeResources.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">Ingen ressurser lagt til ennå.</p>
                ) : (
                  <div className="space-y-2">
                    {themeResources.map((resource: any) => {
                      const isEditing = editingResourceId === resource.id;
                      const typeLabel = RESOURCE_TYPES.find(t => t.value === resource.type)?.label ?? resource.type;
                      return (
                        <div key={resource.id} className="rounded-xl border border-border/50 bg-background p-4">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input value={editResourceForm.title} onChange={(e) => setEditResourceForm({ ...editResourceForm, title: e.target.value })} className={inputClass} placeholder="Tittel" />
                                <select value={editResourceForm.type} onChange={(e) => setEditResourceForm({ ...editResourceForm, type: e.target.value })} className={inputClass}>
                                  {RESOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <input value={editResourceForm.link} onChange={(e) => setEditResourceForm({ ...editResourceForm, link: e.target.value })} className={inputClass} placeholder="Lenke" />
                                <div className="flex items-center gap-2">
                                  <input value={editResourceForm.image_url} onChange={(e) => setEditResourceForm({ ...editResourceForm, image_url: e.target.value })} className={inputClass} placeholder="Bilde-URL" />
                                  <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImageUpload(file, "edit");
                                  }} />
                                  <button onClick={() => editFileInputRef.current?.click()} disabled={uploadingImage} className="shrink-0 p-3 rounded-xl border border-input bg-background hover:bg-accent transition-colors text-muted-foreground" title="Last opp bilde">
                                    <Upload className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea value={editResourceForm.description} onChange={(e) => setEditResourceForm({ ...editResourceForm, description: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[60px]`} placeholder="Beskrivelse" />
                              </div>
                              {editResourceForm.image_url && (
                                <img src={editResourceForm.image_url} alt="Preview" className="w-20 h-28 object-cover rounded-lg border border-border" />
                              )}
                              <div className="flex gap-2">
                                <button onClick={saveResource} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                                  <Check className="w-3.5 h-3.5" /> Lagre
                                </button>
                                <button onClick={() => setEditingResourceId(null)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">
                                  <X className="w-3.5 h-3.5" /> Avbryt
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              {resource.image_url && (
                                <img src={resource.image_url} alt={resource.title} className="w-12 h-16 object-cover rounded-lg border border-border shrink-0" />
                              )}
                              {!resource.image_url && (
                                <div className="w-12 h-16 rounded-lg border border-border bg-muted/50 flex items-center justify-center shrink-0">
                                  <Image className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <SortButtons
                                onMoveUp={() => swapResourceWithNeighbor(resource, -1)}
                                onMoveDown={() => swapResourceWithNeighbor(resource, 1)}
                                isFirst={themeResources.indexOf(resource) === 0}
                                isLast={themeResources.indexOf(resource) === themeResources.length - 1}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground text-sm truncate">{resource.title}</p>
                                  <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5 shrink-0">{typeLabel}</span>
                                </div>
                                {resource.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{resource.description}</p>}
                                {resource.link && (
                                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5">
                                    <ExternalLink className="w-3 h-3" /> Åpne lenke
                                  </a>
                                )}
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button onClick={() => startEditResource(resource)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" title="Rediger">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm("Slette denne ressursen?")) {
                                      onDeleteResource.mutate(resource.id, {
                                        onSuccess: () => toast.success("Ressurs slettet"),
                                        onError: (e: any) => toast.error(e.message),
                                      });
                                    }
                                  }}
                                  className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                                  title="Slett"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ========== MAIN ADMIN PAGE ==========
const AdminPage = () => {
  const { user, loading, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("stats");
  const { data: themes } = useThemes();
  const { data: videos } = useVideos();
  const { data: allResources } = useAllThemeResources();

  const createTheme = useCreateTheme();
  const updateTheme = useUpdateTheme();
  const deleteTheme = useDeleteTheme();
  const createVideo = useCreateVideo();
  const updateVideo = useUpdateVideo();
  const deleteVideo = useDeleteVideo();
  const createResource = useCreateThemeResource();
  const updateResource = useUpdateThemeResource();
  const deleteResource = useDeleteThemeResource();
  const uploadImage = useUploadResourceImage();
  const swapThemeOrder = useSwapThemeOrder();
  const swapVideoOrder = useSwapVideoOrder();
  const swapResourceOrder = useSwapResourceOrder();
  const { data: siteSettings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { data: feedback } = useFeedback();
  const { data: pageViews } = usePageViews();

  // Add theme form
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [newTheme, setNewTheme] = useState({ title: "", description: "", icon: "heart" });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Record<string, string> | null>(null);
  const currentSettings = settingsForm ?? siteSettings ?? {};

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
    { id: "stats", label: "Statistikk", icon: BarChart3 },
    { id: "themes", label: "Temaer & Videoer", icon: LayoutGrid },
    { id: "navigation", label: "Navigasjon", icon: Navigation },
    { id: "five_tips", label: "5 Råd", icon: Sparkles },
    { id: "settings", label: "Innstillinger", icon: Settings },
  ];

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

  const inputClass = "rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Adminpanel</h1>
            <p className="text-sm text-muted-foreground mt-1">Administrer temaer, videoer og innstillinger</p>
          </div>
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
          {tabs.map(({ id, label, icon: TIcon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              <TIcon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ========== STATS TAB ========== */}
        {tab === "stats" && <StatsTab themes={themes} videos={videos} feedback={feedback} pageViews={pageViews} />}

        {/* ========== THEMES & VIDEOS TAB ========== */}
        {tab === "themes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Klikk på et tema for å se og administrere videoene i det.
              </p>
              <button
                onClick={() => setShowAddTheme(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Nytt tema
              </button>
            </div>

            <AnimatePresence>
              {showAddTheme && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card rounded-2xl card-shadow border border-border/50 p-6 overflow-hidden"
                >
                  <h3 className="font-medium text-foreground mb-4">Nytt tema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Tittel" value={newTheme.title} onChange={(e) => setNewTheme({ ...newTheme, title: e.target.value })} className={inputClass + " w-full"} />
                    <select value={newTheme.icon} onChange={(e) => setNewTheme({ ...newTheme, icon: e.target.value })} className={inputClass + " w-full"}>
                      {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                    </select>
                    <textarea placeholder="Beskrivelse" value={newTheme.description} onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })} className={`md:col-span-2 ${inputClass} w-full min-h-[80px]`} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleAddTheme} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Lagre</button>
                    <button onClick={() => setShowAddTheme(false)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">Avbryt</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {themes?.map((theme) => (
              <ThemeDetail
                key={theme.id}
                theme={theme}
                videos={videos ?? []}
                themes={themes}
                resources={allResources ?? []}
                onUpdateTheme={updateTheme}
                onDeleteTheme={deleteTheme}
                onCreateVideo={createVideo}
                onUpdateVideo={updateVideo}
                onDeleteVideo={deleteVideo}
                onCreateResource={createResource}
                onUpdateResource={updateResource}
                onDeleteResource={deleteResource}
                onUploadImage={uploadImage}
              />
            ))}
          </div>
        )}

        {/* ========== SETTINGS TAB ========== */}
        {tab === "settings" && (
          <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-medium text-foreground">Nettside-innstillinger</h2>
              <p className="text-sm text-muted-foreground mt-1">Rediger teksten som vises på forsiden</p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Hovedtittel</label>
                <input
                  value={currentSettings.hero_title ?? ""}
                  onChange={(e) => setSettingsForm({ ...currentSettings, hero_title: e.target.value })}
                  className={inputClass + " w-full"}
                  placeholder="Verktøy for en bedre hverdag"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Undertekst</label>
                <textarea
                  value={currentSettings.hero_subtitle ?? ""}
                  onChange={(e) => setSettingsForm({ ...currentSettings, hero_subtitle: e.target.value })}
                  className={inputClass + " w-full min-h-[80px]"}
                  placeholder="Kort beskrivelse under tittelen"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Introduksjonstekst</label>
                <textarea
                  value={currentSettings.intro_text ?? ""}
                  onChange={(e) => setSettingsForm({ ...currentSettings, intro_text: e.target.value })}
                  className={inputClass + " w-full min-h-[120px]"}
                  placeholder="Beskriv hva Livetskjer.no er..."
                />
              </div>
              <button
                onClick={async () => {
                  try {
                    const keys = ["hero_title", "hero_subtitle", "intro_text"];
                    for (const key of keys) {
                      if (currentSettings[key] !== siteSettings?.[key]) {
                        await updateSetting.mutateAsync({ key, value: currentSettings[key] ?? "" });
                      }
                    }
                    toast.success("Innstillinger lagret!");
                    setSettingsForm(null);
                  } catch (e: any) {
                    toast.error(e.message);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Lagre endringer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
