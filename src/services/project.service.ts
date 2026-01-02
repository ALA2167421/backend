import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class ProjectService {

  static async findOne(id: number) {
    return await prisma.projects.findUnique({
      where: { id },
      include: {
        projects_users: { include: { users: true } },
        roles: true,
        units: true,
        lessons: true
      }
    });
  }

  static async create(data: any, userId: number) {
    // Generate exuid from name if missing (Simulates before_validation)
    const exuid = data.exuid && data.exuid.length > 0 ? data.exuid : data.name;

    return await prisma.projects.create({
      data: {
        ...data,
        uuid: uuidv4(),
        exuid: exuid,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }

  static async addMember(projectId: number, userId: number, userIdModifier: number) {
    return await prisma.projects_users.create({
      data: {
        project_id: projectId,
        user_id: userId,
        created_by: userIdModifier,
        updated_by: userIdModifier,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
