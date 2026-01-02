import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class IssueService {

  static async findOne(id: number) {
    return await prisma.issues.findUnique({
      where: { id },
      include: {
        issue_comments: true,
        // Include lookups for type, status, priority
        lookups_issues_type_idTolookups: true,
        lookups_issues_status_idTolookups: true,
        lookups_issues_priority_idTolookups: true
      }
    });
  }

  static async create(data: any, userId: number) {
    return await prisma.issues.create({
      data: {
        ...data,
        uuid: uuidv4(),
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
