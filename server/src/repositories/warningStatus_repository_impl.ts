import { WarningCategory, WarningStatus } from "@prisma/client";

import prisma from "@/lib/prisma";

import BaseRepository from "./baseRepository";

/*

			//-- Warning Status Repository --//

*/

export class WarningStatusRepository extends BaseRepository<WarningStatus> {
  constructor() {
    super(prisma.warningStatus);
  }

  //create a warning
  async createWarningStatus(data: {
    studentId: string;
    comment: string;
    warningType?: WarningCategory | null;
  }) {
    return this.modelClient.create({
      data: {
        studentId: data.studentId,
        comment: data.comment,
        warningType: data.warningType ?? null,
      },
    });
  }

  //retrieve a warning / Multiple warning if there are any
  async getWarningsByStudentId(studentId: string) {
    return this.modelClient.findMany({
      where: { studentId },
      orderBy: {
        id: "desc",
      },
    });
  }
}
