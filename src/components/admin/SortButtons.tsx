import { ChevronUp, ChevronDown } from "lucide-react";

interface SortButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function SortButtons({ onMoveUp, onMoveDown, isFirst, isLast }: SortButtonsProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
        disabled={isFirst}
        className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        title="Flytt opp"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
        disabled={isLast}
        className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
        title="Flytt ned"
      >
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
