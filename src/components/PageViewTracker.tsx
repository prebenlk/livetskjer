import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTrackPageView } from "@/hooks/use-data";

export const PageViewTracker = () => {
  const location = useLocation();
  const track = useTrackPageView();

  useEffect(() => {
    track.mutate(location.pathname);
  }, [location.pathname]);

  return null;
};
