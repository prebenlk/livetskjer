import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ThoughtRow {
  id: number;
  situasjon: string;
  automatiskTanke: string;
  folelse: string;
  alternativTanke: string;
  utfall: string;
}

const EMPTY_ROW = (): ThoughtRow => ({
  id: Date.now(),
  situasjon: "",
  automatiskTanke: "",
  folelse: "",
  alternativTanke: "",
  utfall: "",
});

export function ThoughtTestingForm({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState<ThoughtRow[]>([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);
  const printRef = useRef<HTMLDivElement>(null);

  const updateRow = (id: number, field: keyof Omit<ThoughtRow, "id">, value: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, EMPTY_ROW()]);

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const resetAll = () => setRows([EMPTY_ROW(), EMPTY_ROW(), EMPTY_ROW()]);

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { key: "situasjon" as const, label: "Situasjon", placeholder: "Beskriv situasjonen..." },
    { key: "automatiskTanke" as const, label: "Automatisk tanke", placeholder: "Hva tenkte du?" },
    { key: "folelse" as const, label: "Følelse", placeholder: "Hva følte du? (0-100%)" },
    { key: "alternativTanke" as const, label: "Alternativ tanke", placeholder: "Finnes det en annen måte å tenke på?" },
    { key: "utfall" as const, label: "Utfall", placeholder: "Hvordan føler du deg nå?" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto p-4 md:p-8"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={printRef}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-6xl bg-card rounded-2xl border border-border/40 shadow-2xl print:shadow-none print:border-none print:rounded-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30 print:border-border">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Uttesting av negative automatiske tanker
            </h2>
            <p className="text-sm text-muted-foreground mt-1">5-kolonneskjema — fyll ut direkte</p>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1.5 text-muted-foreground">
              <RotateCcw className="w-4 h-4" />
              Nullstill
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-1.5 text-muted-foreground">
              <Printer className="w-4 h-4" />
              Skriv ut
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
              ✕
            </Button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 border-b border-border/30 bg-muted/30"
                    style={{ width: "19%" }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-10 border-b border-border/30 bg-muted/30 print:hidden" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.id} className="border-b border-border/20 last:border-b-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2 align-top">
                      <Textarea
                        value={row[col.key]}
                        onChange={(e) => updateRow(row.id, col.key, e.target.value)}
                        placeholder={col.placeholder}
                        className="min-h-[80px] text-sm bg-transparent border-border/20 focus:border-primary/40 resize-none print:border-none print:p-0 print:min-h-[60px]"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 align-top print:hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length <= 1}
                      className="text-muted-foreground hover:text-destructive mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden p-4 space-y-6">
          {rows.map((row, idx) => (
            <div key={row.id} className="glass rounded-xl border border-border/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Rad {idx + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length <= 1}
                  className="text-muted-foreground hover:text-destructive h-7 w-7"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              {columns.map((col) => (
                <div key={col.key} className="mb-3 last:mb-0">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {col.label}
                  </label>
                  <Textarea
                    value={row[col.key]}
                    onChange={(e) => updateRow(row.id, col.key, e.target.value)}
                    placeholder={col.placeholder}
                    className="min-h-[60px] text-sm bg-transparent border-border/20 focus:border-primary/40 resize-none"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Add row button */}
        <div className="p-4 border-t border-border/30 print:hidden">
          <Button
            variant="outline"
            onClick={addRow}
            className="w-full gap-2 border-dashed border-border/40 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
            Legg til rad
          </Button>
        </div>

        {/* Info */}
        <div className="px-6 pb-6 print:hidden">
          <p className="text-xs text-muted-foreground/60 text-center">
            Skjemaet lagres ikke — det er helt anonymt. Bruk «Skriv ut» for å ta vare på det.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
