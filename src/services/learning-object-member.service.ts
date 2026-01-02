import prisma from './base.service';

export class LearningObjectMemberService {

  static async addMember(data: any, userId: number) {
    return await prisma.$transaction(async (tx) => {
      // Create the member
      const newMember = await tx.learning_objects_roles_users.create({
        data: {
          learning_object_id: data.learning_object_id,
          user_id: data.user_id,
          role_id: data.role_id,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // Logic: If member exists in parent Lesson, remove from Lesson (Simulates after_create_handler)
      // Note: We need to fetch the lesson ID via learning object first
      const lo = await tx.learning_objects.findUnique({ where: { id: data.learning_object_id }, select: { lesson_id: true } });
      
      if (lo && lo.lesson_id) {
        await tx.lessons_roles_users.deleteMany({
          where: {
            lesson_id: lo.lesson_id,
            user_id: data.user_id,
            role_id: data.role_id
          }
        });
      }

      return newMember;
    });
  }

  static async copy(originalMemberKeys: {loId: number, userId: number, roleId: number}, newLoId: number, userId: number) {
    const original = await prisma.learning_objects_roles_users.findUnique({
      where: {
        learning_object_id_role_id_user_id: {
          learning_object_id: originalMemberKeys.loId,
          role_id: originalMemberKeys.roleId,
          user_id: originalMemberKeys.userId
        }
      }
    });

    if (!original) throw new Error("Member not found");

    return await prisma.learning_objects_roles_users.create({
      data: {
        learning_object_id: newLoId,
        user_id: original.user_id,
        role_id: original.role_id,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
