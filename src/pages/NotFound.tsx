import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Siden ble ikke funnet</p>
          <Link to="/" className="text-primary font-medium hover:underline">
            Gå til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
