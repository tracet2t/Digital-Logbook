import { os } from "@orpc/server";

import {
  createApplication,
  getAllApplications,
  getApplicationByEmail,
  getApplicationById,
  getApplicationsByDateRange,
  getApplicationsByStatus,
  getApplicationSummary,
  searchApplications,
  updateApplicationStatus,
} from "./onboarding";

/**
 * Main application router
 * Combines all domain-specific routers into a single router
 *
 * To add a new router:
 * 1. Create a new file in /routers/ (e.g., users.ts, projects.ts)
 * 2. Export procedures from that file
 * 3. Import and add to the router object below
 *
 * Example:
 * import { getUsers, createUser } from "./users";
 *
 * export const router = os.router({
 *   onboarding: { ... },
 *   users: {
 *     getUsers: getUsers,
 *     createUser: createUser,
 *   }
 * });
 */
export const router = os.router({
  onboarding: {
    createApplication: createApplication,
    getApplicationById: getApplicationById,
    getApplicationByEmail: getApplicationByEmail,
    getApplicationsByStatus: getApplicationsByStatus,
    searchApplications: searchApplications,
    getApplicationsByDateRange: getApplicationsByDateRange,
    getApplicationSummary: getApplicationSummary,
    getAllApplications: getAllApplications,
    updateApplicationStatus: updateApplicationStatus,
  },
  // Add more routers here:
  // users: { ... },
  // projects: { ... },
  // reports: { ... },
});

// Export the router type for client usage
export type AppRouter = typeof router;
