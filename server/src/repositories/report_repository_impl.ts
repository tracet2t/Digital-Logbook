import prisma from "@/lib/prisma";
import { Report,} from "@prisma/client";
import BaseRepository from "./baseRepository";

/*

      //-- Report Repository --//

*/

export class ReportRepository extends BaseRepository<Report> {
  constructor() {
    super(prisma.report);
  }
}