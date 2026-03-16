import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Leaf, LogIn } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laster...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      toast.error("Feil e-post eller passord");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-6" style={{ minHeight: "calc(100vh - 4rem)" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--theme-sleep))] flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-7 h-7 text-[hsl(var(--primary-foreground))]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin-innlogging</h1>
            <p className="text-sm text-muted-foreground mt-2">Logg inn for å administrere innhold</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="admin@livetskjer.no"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Passord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {submitting ? "Logger inn..." : "Logg inn"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
