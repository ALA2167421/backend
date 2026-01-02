import prisma from './base.service';

export class LearningObjectCustomXmlService {
  
  static async create(data: any, userId: number) {
    // Unique key scope validation is handled by Prisma/Database constraint
    return await prisma.learning_object_custom_xmls.create({
      data: {
        ...data,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
