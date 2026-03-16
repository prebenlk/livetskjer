import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user } = useAuth();
  const isAdmin = user?.email === "preben-karlsen@hotmail.com";

  return (
    <header className="w-full border-b border-border/20 glass-strong sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-foreground font-bold text-lg group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--theme-sleep))] flex items-center justify-center shadow-lg shadow-[hsl(var(--primary)/0.25)] group-hover:shadow-[hsl(var(--primary)/0.4)] transition-shadow">
            <Leaf className="w-4.5 h-4.5 text-[hsl(var(--primary-foreground))]" />
          </div>
          <span className="tracking-tight">Livetskjer.no</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            Hjem
          </Link>
          <Link
            to="/verktoy"
            className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            Verktøy
          </Link>
          {isAdmin ? (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Admin
            </Link>
          ) : user ? null : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Logg inn
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}