import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';
import { ScreenService } from './screen.service';

export class TemplateService {

  static async duplicate(templateId: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.templates.findUnique({
        where: { id: templateId },
        include: { screen_items: true }
      });

      if (!original) throw new Error("Template not found");

      // 1. Shallow Copy
      const newTemplate = await tx.templates.create({
        data: {
          uuid: uuidv4(),
          name: "copy of " + original.name,
          description: original.description,
          template_category_id: original.template_category_id,
          layout_id: original.layout_id,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // 2. Common Copy (Items, Background, etc) - Logic similar to ScreenService.copy
      // Calling logic from ScreenService would be ideal if refactored to accept 'tx'
      // For now, placeholders:
      
      return newTemplate;
    });
  }

  // Logic for Template Propagation would be implemented here
  // involving iterating over linked screens and updating items
  static async propagate(templateId: number) {
    // This is a complex logic that requires comparing template items 
    // with derived screen items and applying updates.
    // Recommended to implement as a background job if possible.
  }
}
