import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class AssessmentService {

  static async create(data: any, userId: number) {
    return await prisma.assessments.create({
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

  static async deleteAssessment(id: number) {
    return await prisma.$transaction([
      prisma.learning_objects_assessments.deleteMany({ where: { assessment_id: id } }),
      prisma.assessments.delete({ where: { id } })
    ]);
  }
}
