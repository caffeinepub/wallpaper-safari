import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob, Wallpaper } from "../backend";
import { useActor } from "./useActor";

export function useGetAllWallpapers() {
  const { actor, isFetching } = useActor();
  return useQuery<Wallpaper[]>({
    queryKey: ["wallpapers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWallpapers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWallpaper(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Wallpaper | null>({
    queryKey: ["wallpaper", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getWallpaper(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000,
  });
}

export function useLikeWallpaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.likeWallpaper(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["wallpapers"] });
      const prev = queryClient.getQueryData<Wallpaper[]>(["wallpapers"]);
      queryClient.setQueryData<Wallpaper[]>(
        ["wallpapers"],
        (old) =>
          old?.map((w) =>
            w.id === id ? { ...w, likes: w.likes + BigInt(1) } : w,
          ) ?? [],
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["wallpapers"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
    },
  });
}

type DownloadVars = { id: string; url: string };

export function useDownloadWallpaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    DownloadVars,
    { prev: Wallpaper[] | undefined }
  >({
    mutationFn: async ({ id, url }: DownloadVars) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.downloadWallpaper(id);
      window.open(url, "_blank");
    },
    onMutate: async ({ id }: DownloadVars) => {
      await queryClient.cancelQueries({ queryKey: ["wallpapers"] });
      const prev = queryClient.getQueryData<Wallpaper[]>(["wallpapers"]);
      queryClient.setQueryData<Wallpaper[]>(
        ["wallpapers"],
        (old) =>
          old?.map((w) =>
            w.id === id ? { ...w, downloads: w.downloads + BigInt(1) } : w,
          ) ?? [],
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["wallpapers"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      author,
      text,
    }: { id: string; author: string; text: string }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.addComment(id, author, text);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
    },
  });
}

export function useAddWallpaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      category,
      blob,
    }: {
      id: string;
      title: string;
      category: string;
      blob: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.addWallpaper(id, title, category, blob);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
    },
  });
}

export function useDeleteWallpaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteWallpaper(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["wallpapers"] });
      const prev = queryClient.getQueryData<Wallpaper[]>(["wallpapers"]);
      queryClient.setQueryData<Wallpaper[]>(
        ["wallpapers"],
        (old) => old?.filter((w) => w.id !== id) ?? [],
      );
      return { prev };
    },
    onError: (_err, _id, context) => {
      if (context?.prev) {
        queryClient.setQueryData(["wallpapers"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wallpapers"] });
    },
  });
}
