import { os } from "@orpc/server";

import {
  deleteInvitation,
  getInvitations,
  sendBulkInvitations,
  sendInvitation,
  updateInvitationStatus,
  validateInvitationToken,
} from "./invitations";
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
  invitations: {
    sendInvitation,
    sendBulkInvitations,
    getInvitations,
    validateInvitationToken,
    updateInvitationStatus,
    deleteInvitation,
  },
});

// Export the router type for client usage
export type AppRouter = typeof router;
