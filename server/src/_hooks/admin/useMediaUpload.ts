import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

interface UploadResult {
  url: string;
  key: string;
}

export function useUploadImage() {
  return useMutation<UploadResult, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

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
    onError: (err) => {
      toast.error("Failed to upload image", { description: err.message });
    },
  });
}
