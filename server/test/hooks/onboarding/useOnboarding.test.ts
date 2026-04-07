import {
	beforeEach,
	describe,
	expect,
	jest,
	test,
} from "@jest/globals";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useOnboarding } from "@/hooks/onboarding/useOnboarding";

jest.mock("@tanstack/react-query", () => ({
	useMutation: jest.fn(),
	useQueryClient: jest.fn(),
}));

jest.mock("sonner", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

type MutationOptions = {
	mutationFn: (data: {
		fullName: string;
		email: string;
		university: string;
		degreeProgram: string;
		cvLink: string;
	}) => Promise<unknown>;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

describe("useOnboarding", () => {
	const mockedUseMutation = useMutation as unknown as jest.Mock;
	const mockedUseQueryClient = useQueryClient as unknown as jest.Mock;
	const mockedToastSuccess = toast.success as unknown as jest.Mock;
	const mockedToastError = toast.error as unknown as jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("wires mutation and returns mutation result", () => {
		const queryClient = { invalidateQueries: jest.fn() };
		const mutationResult = { mutate: jest.fn() };

		mockedUseQueryClient.mockReturnValue(queryClient);
		mockedUseMutation.mockReturnValue(mutationResult);

		const result = useOnboarding();

		expect(result).toBe(mutationResult);
		expect(mockedUseMutation).toHaveBeenCalledTimes(1);
		const options = mockedUseMutation.mock.calls[0][0] as MutationOptions;
		expect(typeof options.mutationFn).toBe("function");
		expect(typeof options.onSuccess).toBe("function");
		expect(typeof options.onError).toBe("function");
	});

	test("calls API and returns parsed JSON on success", async () => {
		const queryClient = { invalidateQueries: jest.fn() };

		mockedUseQueryClient.mockReturnValue(queryClient);
		mockedUseMutation.mockReturnValue({ mutate: jest.fn() });

		useOnboarding();
		const options = mockedUseMutation.mock.calls[0][0] as MutationOptions;

		const requestBody = {
			fullName: "Jane Doe",
			email: "jane@example.com",
			university: "State University",
			degreeProgram: "CS",
			cvLink: "https://example.com/cv.pdf",
		};

		const responseBody = {
			message: "ok",
			application: {
				id: "app_1",
				fullName: "Jane Doe",
				email: "jane@example.com",
				university: "State University",
				degreeProgram: "CS",
				cvLink: "https://example.com/cv.pdf",
				status: "pending",
				createdAt: "2026-04-07T00:00:00.000Z",
				updatedAt: "2026-04-07T00:00:00.000Z",
			},
		};

		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			json: jest.fn().mockResolvedValue(responseBody),
		});
		(globalThis as { fetch: typeof fetch }).fetch =
			fetchMock as unknown as typeof fetch;

		const result = await options.mutationFn(requestBody);

		expect(result).toEqual(responseBody);
		expect(fetchMock).toHaveBeenCalledWith("/api/onboarding", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestBody),
		});
	});

	test("throws API message when response is not ok", async () => {
		const queryClient = { invalidateQueries: jest.fn() };

		mockedUseQueryClient.mockReturnValue(queryClient);
		mockedUseMutation.mockReturnValue({ mutate: jest.fn() });

		useOnboarding();
		const options = mockedUseMutation.mock.calls[0][0] as MutationOptions;

		const fetchMock = jest.fn().mockResolvedValue({
			ok: false,
			json: jest.fn().mockResolvedValue({ message: "Email already exists" }),
		});
		(globalThis as { fetch: typeof fetch }).fetch =
			fetchMock as unknown as typeof fetch;

		await expect(
			options.mutationFn({
				fullName: "Jane Doe",
				email: "jane@example.com",
				university: "State University",
				degreeProgram: "CS",
				cvLink: "https://example.com/cv.pdf",
			}),
		).rejects.toThrow("Email already exists");
	});

	test("runs success callback toast and cache invalidation", () => {
		const queryClient = { invalidateQueries: jest.fn() };

		mockedUseQueryClient.mockReturnValue(queryClient);
		mockedUseMutation.mockReturnValue({ mutate: jest.fn() });

		useOnboarding();
		const options = mockedUseMutation.mock.calls[0][0] as MutationOptions;

		options.onSuccess();

		expect(mockedToastSuccess).toHaveBeenCalledWith(
			"Application submitted successfully!",
		);
		expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
			queryKey: ["onboarding-applications"],
		});
	});

	test("runs error callback toast", () => {
		const queryClient = { invalidateQueries: jest.fn() };

		mockedUseQueryClient.mockReturnValue(queryClient);
		mockedUseMutation.mockReturnValue({ mutate: jest.fn() });

		useOnboarding();
		const options = mockedUseMutation.mock.calls[0][0] as MutationOptions;

		options.onError(new Error("Request failed"));

		expect(mockedToastError).toHaveBeenCalledWith("Request failed");
	});
});