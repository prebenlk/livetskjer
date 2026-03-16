import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user } = useAuth();
  const isAdmin = user?.email === "preben-karlsen@hotmail.com";

  return (
    <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground font-semibold text-lg">
          <Leaf className="w-5 h-5 text-primary" />
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
