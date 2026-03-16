import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { PageViewTracker } from "@/components/PageViewTracker";
import Index from "./pages/Index.tsx";
import ThemePage from "./pages/ThemePage.tsx";
import VideoPage from "./pages/VideoPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ToolsPage from "./pages/ToolsPage.tsx";
import FiveGrepPage from "./pages/FiveGrepPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageViewTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tema/:themeId" element={<ThemePage />} />
            <Route path="/tema/:themeId/video/:videoId" element={<VideoPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/verktoy" element={<ToolsPage />} />
            <Route path="/verktoy/:themeId" element={<ToolsPage />} />
            <Route path="/fem-grep" element={<FiveGrepPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

