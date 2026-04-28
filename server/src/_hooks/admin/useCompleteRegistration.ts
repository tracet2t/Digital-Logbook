import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CompleteRegistrationPayload {
  email: string;
  token: string;
  tempPassword: string;
  newPassword: string;
}

interface CompleteRegistrationResponse {
  success: boolean;
  role: string;
}

export const useCompleteRegistration = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CompleteRegistrationPayload) => {
      const res = await fetch("/api/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete registration");
      }

      return data as CompleteRegistrationResponse;
    },
    onSuccess: (_, variables) => {
      toast.success(
        "Account created successfully! Please login with your new password.",
      );
      router.push(`/login?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
};
