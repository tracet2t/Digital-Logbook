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

export const router = os.router({
  onboarding: {
    createApplication,
    getApplicationById,
    getApplicationByEmail,
    getApplicationsByStatus,
    searchApplications,
    getApplicationsByDateRange,
    getApplicationSummary,
    getAllApplications,
    updateApplicationStatus,
  },
});

// Export the router type for client usage
export type AppRouter = typeof router;
