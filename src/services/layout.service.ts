import prisma from './base.service';

export class LayoutService {

  static async findOne(id: number) {
    return await prisma.layouts.findUnique({
      where: { id },
      include: {
        layout_items: { include: { layout_items_components: true } }
      }
    });
  }

  // LayoutItem logic moved here or can be separate
  static async deleteLayoutItem(itemId: number) {
    return await prisma.$transaction([
      prisma.layout_items_components.deleteMany({ where: { layout_item_id: itemId } }),
      prisma.layout_items.delete({ where: { id: itemId } })
    ]);
  }
}
