import prisma from "@/lib/prisma";

import BaseRepository from "./baseRepository";

type MenteeApplication = any;
type MenteeApplicationStatus = "pending" | "approved" | "rejected";

/*

      //-- Onboarding Repository --//

*/

export class OnboardingRepository extends BaseRepository<MenteeApplication> {
  constructor() {
    super(prisma.menteeApplication);
  }

  /**
   * Find a mentee application by email address
   * @param email - The email to search for
   * @returns The mentee application if found, null otherwise
   */
  async findByEmail(email: string): Promise<MenteeApplication | null> {
    return this.modelClient.findUnique({
      where: { email },
    });
  }

  /**
   * Find all applications with a specific status
   * @param status - The application status to filter by
   * @returns Array of mentee applications matching the status
   */
  async findByStatus(
    status: MenteeApplicationStatus,
  ): Promise<MenteeApplication[]> {
    return this.modelClient.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get all pending applications
   * @returns Array of pending mentee applications
   */
  async getPendingApplications(): Promise<MenteeApplication[]> {
    return this.findByStatus("pending");
  }

  /**
   * Get all approved applications
   * @returns Array of approved mentee applications
   */
  async getApprovedApplications(): Promise<MenteeApplication[]> {
    return this.findByStatus("approved");
  }

  /**
   * Get all rejected applications
   * @returns Array of rejected mentee applications
   */
  async getRejectedApplications(): Promise<MenteeApplication[]> {
    return this.findByStatus("rejected");
  }

  /**
   * Update the status of an application
   * @param id - The application ID
   * @param status - The new status
   * @returns The updated mentee application
   */
  async updateStatus(
    id: string,
    status: MenteeApplicationStatus,
  ): Promise<MenteeApplication> {
    return this.modelClient.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Approve an application by ID
   * @param id - The application ID
   * @returns The updated mentee application
   */
  async approveApplication(id: string): Promise<MenteeApplication> {
    return this.updateStatus(id, "approved");
  }

  /**
   * Reject an application by ID
   * @param id - The application ID
   * @returns The updated mentee application
   */
  async rejectApplication(id: string): Promise<MenteeApplication> {
    return this.updateStatus(id, "rejected");
  }

  /**
   * Create a new mentee application from showcase form submission
   * @param data - The application data
   * @returns The newly created mentee application
   */
  async createApplication(
    data: Omit<MenteeApplication, "id" | "createdAt" | "updatedAt" | "status">,
  ): Promise<MenteeApplication> {
    return this.modelClient.create({
      data: {
        ...data,
        status: "pending",
      },
    });
  }

  /**
   * Get application with full details
   * @param id - The application ID
   * @returns The mentee application with all fields, null if not found
   */
  async getApplicationById(id: string): Promise<MenteeApplication | null> {
    return this.getById(id);
  }

  /**
   * Get all applications created within a date range
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Array of mentee applications created within the date range
   */
  async getApplicationsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<MenteeApplication[]> {
    return this.modelClient.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Search applications by name or email
   * @param searchTerm - The search term (full name or email)
   * @returns Array of matching mentee applications
   */
  async searchApplications(searchTerm: string): Promise<MenteeApplication[]> {
    return this.modelClient.findMany({
      where: {
        OR: [
          { fullName: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get count of applications by status
   * @returns Object with counts for each status
   */
  async getApplicationCountByStatus(): Promise<
    Record<MenteeApplicationStatus, number>
  > {
    const [pending, approved, rejected] = await Promise.all([
      this.modelClient.count({ where: { status: "pending" } }),
      this.modelClient.count({ where: { status: "approved" } }),
      this.modelClient.count({ where: { status: "rejected" } }),
    ]);

    return {
      pending,
      approved,
      rejected,
    };
  }
}
