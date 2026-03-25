import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/use-data";
import { Plus, Trash2, Pencil, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SortButtons } from "./SortButtons";

interface Tip {
  title: string;
  short: string;
  detail: string;
  icon: string;
  color: string;
}

const ICON_OPTIONS = ["eye", "activity", "book-open", "users", "heart", "sparkles", "star", "sun", "zap", "shield"];
const COLOR_OPTIONS = [
  "hsl(275, 55%, 62%)", "hsl(168, 55%, 48%)", "hsl(200, 65%, 55%)",
  "hsl(45, 70%, 55%)", "hsl(340, 65%, 58%)", "hsl(18, 80%, 58%)",
];

export function FiveTipsEditor() {
  const { data: settings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [tips, setTips] = useState<Tip[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Tip>({ title: "", short: "", detail: "", icon: "eye", color: COLOR_OPTIONS[0] });
  const [showAdd, setShowAdd] = useState(false);
  const [newTip, setNewTip] = useState<Tip>({ title: "", short: "", detail: "", icon: "eye", color: COLOR_OPTIONS[0] });

  useEffect(() => {
    if (settings?.five_tips) {
      try { setTips(JSON.parse(settings.five_tips)); } catch { /* ignore */ }
    }
  }, [settings?.five_tips]);

  const save = async (newTips: Tip[]) => {
    try {
      await updateSetting.mutateAsync({ key: "five_tips", value: JSON.stringify(newTips) });
      setTips(newTips);
      toast.success("5 Råd oppdatert!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newTips = [...tips];
    const target = index + direction;
    [newTips[index], newTips[target]] = [newTips[target], newTips[index]];
    save(newTips);
  };

  const deleteTip = (index: number) => {
    if (confirm("Slette dette rådet?")) save(tips.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...tips[index] });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...tips];
    updated[editingIndex] = editForm;
    save(updated);
    setEditingIndex(null);
  };

  const addTip = () => {
    if (!newTip.title) { toast.error("Tittel er påkrevd"); return; }
    save([...tips, newTip]);
    setNewTip({ title: "", short: "", detail: "", icon: "eye", color: COLOR_OPTIONS[0] });
    setShowAdd(false);
  };

  const inputClass = "rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground w-full";

  const renderTipForm = (form: Tip, setForm: (t: Tip) => void, onSave: () => void, onCancel: () => void) => (
    <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input placeholder="Tittel *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
        <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass}>
          {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
        </select>
        <input placeholder="Kort beskrivelse" value={form.short} onChange={(e) => setForm({ ...form, short: e.target.value })} className={`md:col-span-2 ${inputClass}`} />
        <textarea placeholder="Detaljert beskrivelse" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} className={`md:col-span-2 ${inputClass} min-h-[100px]`} />
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Farge</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, color: c })}
                className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? "border-foreground scale-110" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
          <Check className="w-4 h-4" /> Lagre
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">
          <X className="w-4 h-4" /> Avbryt
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-medium text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> 5 råd for hverdagsglede
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Rediger innholdet på 5 Råd-siden</p>
      </div>
      <div className="p-6 space-y-3">
        {tips.map((tip, i) => (
          <div key={i}>
            {editingIndex === i ? (
              renderTipForm(editForm, setEditForm, saveEdit, () => setEditingIndex(null))
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background p-4">
                <SortButtons onMoveUp={() => moveItem(i, -1)} onMoveDown={() => moveItem(i, 1)} isFirst={i === 0} isLast={i === tips.length - 1} />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${tip.color}20`, color: tip.color }}>
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tip.short}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(i)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteTip(i)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}

        {showAdd ? (
          renderTipForm(newTip, setNewTip, addTip, () => setShowAdd(false))
        ) : (
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Nytt råd
          </button>
        )}
      </div>
    </div>
  );
}
