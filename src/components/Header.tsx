import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user } = useAuth();
  const isAdmin = user?.email === "preben-karlsen@hotmail.com";

  return (
    <header className="w-full border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-foreground font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--theme-sleep))] flex items-center justify-center">
            <Leaf className="w-4 h-4 text-[hsl(var(--primary-foreground))]" />
          </div>
          Livetskjer.no
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Hjem</Link>
          {isAdmin ? (
            <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          ) : user ? null : (
            <Link to="/login" className="hover:text-foreground transition-colors">Logg inn</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
