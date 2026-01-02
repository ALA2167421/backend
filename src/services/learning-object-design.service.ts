import prisma from './base.service';

export class LearningObjectDesignService {

  static async createOrUpdate(data: any, userId: number) {
    // Logic: Status defaults to 401 if not provided (Simulates before_validation)
    const statusId = data.status_id || 401;

    return await prisma.learning_object_designs.create({
      data: {
        ...data,
        status_id: statusId,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
  
  static getAnchors(design: any) {
    const anchors = [];
    if (design.anchor_1?.length > 0) anchors.push(design.anchor_1);
    if (design.anchor_2?.length > 0) anchors.push(design.anchor_2);
    if (design.anchor_3?.length > 0) anchors.push(design.anchor_3);
    return anchors;
  }
}
