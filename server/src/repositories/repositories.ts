import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client/extension";
import { User, Activity, Mentorship, MentorActivity, Report, MentorFeedback } from "@prisma/client";
import BaseRepository from "./baseRepository";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }
}

export class ActivityRepository extends BaseRepository<Activity> {
  constructor() {
    super(prisma.activity);
  }
}

export class MentorShipRepository extends BaseRepository<Mentorship> {
  constructor() {
    super(prisma.mentorship);
  }
}


export class MentorActivityRepository extends BaseRepository<MentorActivity> {
  constructor() {
    super(prisma.mentorActivity);
  }
}


export class ReportRepository extends BaseRepository<Report> {
  constructor() {
    super(prisma.report);
  }
}


export class MentorFeedbackRepository extends BaseRepository<MentorFeedback> {
  constructor() {
    super(prisma.mentorFeedback);
  }
}




