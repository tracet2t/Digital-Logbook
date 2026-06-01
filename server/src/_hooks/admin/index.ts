// Admin Hooks Barrel Export

// User Management Hooks
export {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUpdateUserRole,
  useBulkDeleteUsers,
} from "./useAdminUsers";

// Activity Management Hooks
export {
  useUpdateActivity,
  useDeleteActivity,
  useApproveActivity,
} from "./useAdminActivities";

// Report Management Hooks
export { useGenerateReport, useDeleteReport } from "./useAdminReports";

// System Operations Hooks
export { useResetUserPassword, useBulkUploadUsers } from "./useAdminSystem";

// Invitation Hook
export { useInvitation } from "./useInvitation";
export { useBulkSendInvitations } from "./useBulkInvitation";

// Project Hooks
export { useGetAllProjects, useGetProject } from "./useProject";

// Media Upload Hook
export {
  useUploadImage,
  useDeleteImage,
  useReorderImages,
} from "./useMediaUpload";

// Onboarding Approval Hooks
export {
  useOnboardingApplications,
  useUpdateOnboardingStatus,
} from "./useAdminOnboarding";
