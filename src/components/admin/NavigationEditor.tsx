import { useState, useEffect } from "react";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/use-data";
import { Plus, Trash2, GripVertical, Check, Navigation } from "lucide-react";
import { toast } from "sonner";
import { SortButtons } from "./SortButtons";

interface NavItem {
  label: string;
  path: string;
}

export function NavigationEditor() {
  const { data: settings } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const [items, setItems] = useState<NavItem[]>([]);
  const [newItem, setNewItem] = useState({ label: "", path: "" });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (settings?.nav_items) {
      try {
        setItems(JSON.parse(settings.nav_items));
      } catch { /* ignore */ }
    }
  }, [settings?.nav_items]);

  const save = async (newItems: NavItem[]) => {
    try {
      await updateSetting.mutateAsync({ key: "nav_items", value: JSON.stringify(newItems) });
      setItems(newItems);
      toast.success("Navigasjon oppdatert!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addItem = () => {
    if (!newItem.label || !newItem.path) { toast.error("Både navn og sti er påkrevd"); return; }
    const updated = [...items, newItem];
    save(updated);
    setNewItem({ label: "", path: "" });
    setShowAdd(false);
  };

  const removeItem = (index: number) => {
    save(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newItems = [...items];
    const target = index + direction;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    save(newItems);
  };

  const inputClass = "rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground w-full";

  return (
    <div className="bg-card rounded-2xl card-shadow border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-medium text-foreground flex items-center gap-2">
          <Navigation className="w-4 h-4" /> Navigasjonsmeny
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Rediger menypunkter i headeren</p>
      </div>
      <div className="p-6 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-background p-4">
            <SortButtons
              onMoveUp={() => moveItem(i, -1)}
              onMoveDown={() => moveItem(i, 1)}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{item.label}</p>
              <p className="text-xs text-muted-foreground font-mono">{item.path}</p>
            </div>
            <button
              onClick={() => removeItem(i)}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {showAdd ? (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Menynavn (f.eks. Verktøy)" value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} className={inputClass} />
              <input placeholder="Sti (f.eks. /verktoy)" value={newItem.path} onChange={(e) => setNewItem({ ...newItem, path: e.target.value })} className={inputClass} />
            </div>
            <div className="flex gap-2">
              <button onClick={addItem} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Legg til</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent">Avbryt</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Nytt menypunkt
          </button>
        )}
      </div>
    </div>
  );
}
