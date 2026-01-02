import prisma from './base.service';

export class TemplateCategoryService {
  static async findAllByProject(projectId: number) {
    return await prisma.template_categories.findMany({
      where: { project_id: projectId },
      include: { templates: true }
    });
  }
}
