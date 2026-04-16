"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export interface OnboardingRequest {
	fullName: string;
	email: string;
	university: string;
	degreeProgram: string;
	cvLink: string;
}

export interface OnboardingResponse {
	message: string;
	application: {
		id: string;
		fullName: string;
		email: string;
		university: string;
		degreeProgram: string;
		cvLink: string;
		status: "pending" | "approved" | "rejected";
		createdAt: string;
		updatedAt: string;
	};
}

export const useOnboarding = () => {
	const queryClient = useQueryClient();

	return useMutation<OnboardingResponse, Error, OnboardingRequest>({
		mutationFn: async (data) => {
			const res = await fetch("/api/onboarding", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(
					errorData.message || "Failed to submit onboarding application",
				);
			}

			return res.json();
		},
		onSuccess: () => {
			toast.success("Application submitted successfully!");
			queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to submit onboarding application");
		},
	});
};
