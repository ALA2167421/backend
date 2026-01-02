import prisma from './base.service';

export class RoleService {
  
  static readonly ROLES = {
    SME: "primary sme",
    PRODUCER: "primary producer",
    AUTHOR: "primary author",
    TESTER: "primary tester"
  };

  static async deleteRole(id: number) {
    // Manual deletion of links (Simulates before_destroy)
    return await prisma.$transaction([
      prisma.lessons_roles_users.deleteMany({ where: { role_id: id } }),
      prisma.learning_objects_roles_users.deleteMany({ where: { role_id: id } }),
      prisma.roles.delete({ where: { id } })
    ]);
  }
}
