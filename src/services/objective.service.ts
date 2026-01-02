import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class ObjectiveService {
  static async create(data: any, userId: number) {
    return await prisma.objectives.create({
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
  
  static async deleteObjective(id: number) {
    return await prisma.$transaction([
      prisma.learning_objects_objectives.deleteMany({ where: { objective_id: id } }),
      prisma.objectives.delete({ where: { id } })
    ]);
  }
}
