"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ArticleImageItem,
  CoverImage,
} from "@/app/admin/landing-page-cms/_constants";
import { toast } from "sonner";

const ARTICLES_KEY = ["articles"] as const;

interface UploadVariables {
  file: File;
  articleId: string;
  type: "cover" | "gallery";
}

type UploadResult =
  | (CoverImage & { type: "COVER"; order: number })
  | (ArticleImageItem & { type: "GALLERY" });

export function useUploadImage() {
  const queryClient = useQueryClient();
  return useMutation<UploadResult, Error, UploadVariables>({
    mutationFn: async ({ file, articleId, type }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("articleId", articleId);
      formData.append("type", type);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { message?: string }).message ?? "Upload failed",
        );
      }

      return res.json() as Promise<UploadResult>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
      toast.success("Image uploaded");
    },
    onError: (err) => {
      toast.error("Failed to upload image", { description: err.message });
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (imageId) => {
      const res = await fetch(`/api/media/${imageId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { message?: string }).message ?? "Delete failed",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
    onError: (err) => {
      toast.error("Failed to delete image", { description: err.message });
    },
  });
}

interface ReorderVariables {
  articleId: string;
  orderedIds: string[];
}

export function useReorderImages() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ReorderVariables>({
    mutationFn: async ({ articleId, orderedIds }) => {
      const res = await fetch("/api/media/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, orderedIds }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { message?: string }).message ?? "Reorder failed",
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_KEY });
    },
    onError: (err) => {
      toast.error("Failed to reorder images", { description: err.message });
    },
  });
}
