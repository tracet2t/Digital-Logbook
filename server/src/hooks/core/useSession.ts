import { useQuery } from "@tanstack/react-query";
import { getSessionOnClient } from "@/server_actions/getSession";

export interface SessionData {
  id: string;
  role: string;
  fname: string;
  lname: string;
  email: string;
}

/**
 * Shared session hook — uses a single TanStack Query cache entry
 * so session is fetched once and shared across all components.
 */
export const useSession = () => {
  return useQuery<SessionData>({
    queryKey: ["session"],
    queryFn: async () => {
      const data = await getSessionOnClient();
      if (!data) throw new Error("Failed to fetch session");
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 1,
  });
};
