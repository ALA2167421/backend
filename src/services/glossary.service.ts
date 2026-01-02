import prisma from './base.service';

export class GlossaryService {

  static async copy(originalTermId: number, newLearningObjectId: number, userId: number) {
    const original = await prisma.learning_object_glossary.findUnique({ where: { id: originalTermId } });
    if (!original) throw new Error("Term not found");

    return await prisma.learning_object_glossary.create({
      data: {
        term: original.term,
        description: original.description,
        learning_object_id: newLearningObjectId,
        audio_asset_id: original.audio_asset_id,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
