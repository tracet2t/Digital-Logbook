"use client";

import { useEffect, useState } from "react";

import { getSessionOnClient } from "@/server_actions/getSession";
import { useRouter } from "next/navigation";

import { orpcClient } from "@/lib/orpc";

/**
 * API Testing & Documentation Page
 * Access at: http://localhost:3000/api-test
 *
 * ⚠️ PROTECTED: Only accessible by Super Admin users
 * This page lets you test all oRPC procedures interactively
 */
export default function APITestPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Authentication check - Only Super Admin can access
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSessionOnClient();

        if (!session) {
          router.push("/login");
          return;
        }

        if (session.role !== "superAdmin") {
          alert("Access Denied: This page is only accessible to Super Admins");
          router.push("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const testEndpoint = async (
    name: string,
    fn: () => Promise<any>,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fn();
      setResult({ endpoint: name, data: res });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-lg text-gray-600">
            Verifying authentication...
          </div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Security Warning Banner */}
        <div className="mb-4 rounded-lg border-2 border-red-500 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-bold text-red-700">
                Super Admin Access Only
              </h3>
              <p className="text-sm text-red-600">
                This page is protected and only accessible to Super Admin users.
                All API calls are logged.
              </p>
            </div>
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold">API Documentation & Testing</h1>
        <p className="mb-8 text-gray-600">
          Test all available oRPC procedures interactively
        </p>

        {/* Onboarding Endpoints */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold text-blue-600">
            📋 Onboarding
          </h2>

          <div className="space-y-4">
            {/* Get All Applications */}
            <div className="border-b pb-4">
              <h3 className="mb-2 font-mono text-lg font-semibold">
                getAllApplications()
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Fetches all mentee applications including approved students
              </p>
              <button
                onClick={() =>
                  testEndpoint("getAllApplications", async () => {
                    // @ts-ignore
                    return await orpcClient.onboarding.getAllApplications();
                  })
                }
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
                disabled={loading}
              >
                Test Endpoint
              </button>
            </div>

            {/* Get Application Summary */}
            <div className="border-b pb-4">
              <h3 className="mb-2 font-mono text-lg font-semibold">
                getApplicationSummary()
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Get counts of applications by status (pending, approved,
                rejected)
              </p>
              <button
                onClick={() =>
                  testEndpoint("getApplicationSummary", async () => {
                    // @ts-ignore
                    return await orpcClient.onboarding.getApplicationSummary();
                  })
                }
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
                disabled={loading}
              >
                Test Endpoint
              </button>
            </div>

            {/* Create Application */}
            <div className="border-b pb-4">
              <h3 className="mb-2 font-mono text-lg font-semibold">
                createApplication(data)
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Create a new mentee application
              </p>
              <div className="mb-2 rounded bg-gray-100 p-3 font-mono text-sm">
                <pre>
                  {JSON.stringify(
                    {
                      fullName: "string",
                      email: "string (email format)",
                      university: "string",
                      degreeProgram: "string",
                      cvLink: "string (URL)",
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
              <button
                onClick={() =>
                  testEndpoint("createApplication", async () => {
                    // @ts-ignore
                    return await orpcClient.onboarding.createApplication({
                      fullName: "Test User",
                      email: `test${Date.now()}@example.com`,
                      university: "Test University",
                      degreeProgram: "Computer Science",
                      cvLink: "https://example.com/cv.pdf",
                    });
                  })
                }
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
                disabled={loading}
              >
                Test with Sample Data
              </button>
            </div>

            {/* Get by Status */}
            <div className="border-b pb-4">
              <h3 className="mb-2 font-mono text-lg font-semibold">
                getApplicationsByStatus(status)
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Filter applications by status
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    testEndpoint(
                      "getApplicationsByStatus[pending]",
                      async () => {
                        // @ts-ignore
                        return await orpcClient.onboarding.getApplicationsByStatus(
                          {
                            status: "pending",
                          },
                        );
                      },
                    )
                  }
                  className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Pending
                </button>
                <button
                  onClick={() =>
                    testEndpoint(
                      "getApplicationsByStatus[approved]",
                      async () => {
                        // @ts-ignore
                        return await orpcClient.onboarding.getApplicationsByStatus(
                          {
                            status: "approved",
                          },
                        );
                      },
                    )
                  }
                  className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Approved
                </button>
                <button
                  onClick={() =>
                    testEndpoint(
                      "getApplicationsByStatus[rejected]",
                      async () => {
                        // @ts-ignore
                        return await orpcClient.onboarding.getApplicationsByStatus(
                          {
                            status: "rejected",
                          },
                        );
                      },
                    )
                  }
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Rejected
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="pb-4">
              <h3 className="mb-2 font-mono text-lg font-semibold">
                searchApplications(search)
              </h3>
              <p className="mb-2 text-sm text-gray-600">
                Search applications by name, email, or university
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="searchInput"
                  placeholder="Enter search term..."
                  className="flex-1 rounded border px-3 py-2"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      "searchInput",
                    ) as HTMLInputElement;
                    const searchTerm = input.value || "test";
                    testEndpoint("searchApplications", async () => {
                      // @ts-ignore
                      return await orpcClient.onboarding.searchApplications({
                        search: searchTerm,
                      });
                    });
                  }}
                  className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Response Display */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Response</h2>

          {loading && (
            <div className="text-center text-gray-500">Loading...</div>
          )}

          {error && (
            <div className="rounded bg-red-100 p-4 text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && !loading && !error && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-green-600">
                  ✓ {result.endpoint}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(result.data, null, 2),
                    );
                  }}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Copy to Clipboard
                </button>
              </div>
              <pre className="overflow-auto rounded bg-gray-900 p-4 text-sm text-green-400">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}

          {!result && !loading && !error && (
            <div className="text-center text-gray-400">
              Click any button above to test an endpoint
            </div>
          )}
        </div>

        {/* API Information */}
        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-2 text-lg font-bold">📖 API Information</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              <strong>Base URL:</strong>{" "}
              <code className="rounded bg-white px-2 py-1">
                {typeof window !== "undefined" ? window.location.origin : ""}
                /api/rpc
              </code>
            </li>
            <li>
              <strong>Type Safety:</strong> Full TypeScript support with
              autocomplete
            </li>
            <li>
              <strong>Validation:</strong> Automatic Zod validation on all
              inputs/outputs
            </li>
            <li>
              <strong>Authentication:</strong> Some endpoints require Super
              Admin access
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
