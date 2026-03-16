import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ========== SITE SETTINGS ==========

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings" as any)
        .select("key, value");
      if (error) throw error;
      const settings: Record<string, string> = {};
      (data as any[])?.forEach((row: any) => { settings[row.key] = row.value; });
      return settings;
    },
  });
}

export function useUpdateSiteSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await supabase
        .from("site_settings" as any)
        .update({ value, updated_at: new Date().toISOString() } as any)
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}

export function useThemes() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*, videos(id)")
        .order("sort_order");
      if (error) throw error;
      return data.map((t) => ({ ...t, videoCount: t.videos?.length ?? 0 }));
    },
  });
}

export function useTheme(id: string | undefined) {
  return useQuery({
    queryKey: ["themes", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("themes")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useVideos(themeId?: string) {
  return useQuery({
    queryKey: ["videos", themeId],
    queryFn: async () => {
      let q = supabase.from("videos").select("*").order("sort_order");
      if (themeId) q = q.eq("theme_id", themeId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useVideo(id: string | undefined) {
  return useQuery({
    queryKey: ["videos", "single", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: async (params: { video_id: string; rating: string; comment?: string }) => {
      const { error } = await supabase.from("feedback").insert(params);
      if (error) throw error;
    },
  });
}

export function useCreateTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { title: string; description: string; icon: string }) => {
      const { error } = await supabase.from("themes").insert(params);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["themes"] }),
  });
}

export function useUpdateTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...params }: { id: string; title?: string; description?: string; icon?: string }) => {
      const { error } = await supabase.from("themes").update(params).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["themes"] }),
  });
}

export function useDeleteTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("themes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["themes"] }),
  });
}

export function useCreateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { title: string; description: string; url: string; theme_id: string; duration: string }) => {
      const { error } = await supabase.from("videos").insert(params);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["videos"] }),
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...params }: { id: string; title?: string; description?: string; url?: string; theme_id?: string; duration?: string }) => {
      const { error } = await supabase.from("videos").update(params).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      qc.invalidateQueries({ queryKey: ["themes"] });
    },
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["videos"] });
      qc.invalidateQueries({ queryKey: ["themes"] });
    },
  });
}
