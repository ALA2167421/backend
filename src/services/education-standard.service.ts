import prisma from './base.service';

export class EducationStandardService {

  static async findOne(id: number) {
    return await prisma.standards.findUnique({
      where: { id },
      include: {
        standards_standards_mapping: { include: { standards_standard2_idTostandards: true } }
      }
    });
  }

  static async deleteStandard(id: number) {
    // محاكاة before_destroy_handler
    return await prisma.$transaction([
      // حذف العلاقات مع Learning Objects
      prisma.learning_objects_standards.deleteMany({ where: { standard_id: id } }),
      
      // حذف العلاقات مع المعايير الأخرى (Mapping) من الطرفين
      prisma.standards_standards_mapping.deleteMany({
        where: {
          OR: [
            { standard1_id: id },
            { standard2_id: id }
          ]
        }
      }),

      // أخيراً حذف المعيار نفسه
      prisma.standards.delete({ where: { id } })
    ]);
  }
}
