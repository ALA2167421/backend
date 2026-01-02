import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class CustomAttributeService {
  
  static async copy(originalId: number, newScreenItemId: number, userId: number) {
    const original = await prisma.screen_item_attributes.findUnique({ where: { id: originalId } });
    if (!original) throw new Error("Attribute not found");

    return await prisma.screen_item_attributes.create({
      data: {
        uuid: uuidv4(),
        screen_item_id: newScreenItemId,
        name: original.name,
        value: original.value,
        attribute_type: original.attribute_type,
        data_type: original.data_type,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
