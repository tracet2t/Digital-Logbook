import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

interface LogoutResponse {
  success: boolean;
  message?: string;
}

export const useLogout = () => {
  const mutation = useMutation<LogoutResponse, Error>({
    mutationFn: async () => {
      try {
        const response = await fetch("/api/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "manual",
        });

        console.log(
          "Logout response status:",
          response.status,
          "type:",
          response.type,
        );

        // When redirect:"manual" is used, browser returns type "opaqueredirect" with status 0
        if (
          response.type === "opaqueredirect" ||
          response.status === 303 ||
          response.status === 302
        ) {
          console.log("Logout successful with redirect");
          return { success: true, message: "Logged out successfully" };
        }

        if (!response.ok) {
          console.log("Logout response not ok:", response.status);
          throw new Error(`Logout failed with status ${response.status}`);
        }

        return response.json();
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Logout mutation error:", error);
      toast.error("Logout failed. Please try again.");
    },
  });

  return {
    logout: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
