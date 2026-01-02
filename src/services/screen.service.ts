import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';
import { ScreenItemService } from './screen-item.service';
import { AssetService } from './asset.service';

export class ScreenService {

  static async findOne(id: number) {
    return await prisma.screens.findUnique({
      where: { id },
      include: {
        screen_items: { include: { assets: true } }, // Items
        assets_screens_background_asset_idToassets: true, // Background
        assets_screens_guide_asset_idToassets: true, // Guide
        issues: true
      }
    });
  }

  static async copy(originalScreenId: number, newLoId: number | null, newSequence: number, newName: string | null, userId: number, persistencyMap: Map<number, number> | null = null) {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.screens.findUnique({
        where: { id: originalScreenId },
        include: { screen_items: true, learning_objects: true }
      });

      if (!original) throw new Error("Screen not found");

      // Logic: If copying to a new project, unlock template
      let lockedToTemplate = original.locked_to_template;
      let templateId = original.template_id;
      
      if (newLoId) {
        const newLo = await tx.learning_objects.findUnique({ where: { id: newLoId }, include: { projects: true } });
        const oldLo = await tx.learning_objects.findUnique({ where: { id: original.learning_object_id }, include: { projects: true } });
        
        if (newLo && oldLo && newLo.project_id !== oldLo.project_id) {
          lockedToTemplate = false;
          templateId = null;
        }
      }

      // 1. Create Shallow Copy
      const newScreen = await tx.screens.create({
        data: {
          uuid: uuidv4(),
          learning_object_id: newLoId || original.learning_object_id,
          template_id: templateId,
          layout_id: original.layout_id,
          type_id: original.type_id,
          status_id: original.status_id,
          name: newName || original.name,
          sequence: newSequence > 0 ? newSequence : original.sequence,
          script: original.script,
          bindings: original.bindings, // Will be updated later
          locked_to_template: lockedToTemplate,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // 2. Copy Screen Items & Build UUID Map
      const uuidMap = new Map<string, string>();
      
      for (const item of original.screen_items) {
        // Use ScreenItemService to copy item
        // Note: passing 'tx' to keep transaction context would require service refactoring.
        // For simplicity here, we assume ScreenItemService.copyLogic returns data object or handles it.
        // We will call a helper inside ScreenItemService that accepts 'tx'.
        const newItem = await ScreenItemService.copy(item.id, newScreen.id, userId, tx);
        
        if (newItem) {
          uuidMap.set(item.uuid, newItem.uuid);
          if (persistencyMap && (item.source_screen_item_id)) {
             persistencyMap.set(item.id, newItem.id);
          }
        }
      }

      // 3. Update Bindings
      if (newScreen.bindings && uuidMap.size > 0) {
        let updatedBindings = newScreen.bindings;
        uuidMap.forEach((newUuid, oldUuid) => {
           updatedBindings = updatedBindings.replace(new RegExp(`"${oldUuid}"`, 'g'), `"${newUuid}"`);
        });
        await tx.screens.update({ where: { id: newScreen.id }, data: { bindings: updatedBindings } });
      }

      // 4. Copy Background & Guide (Assets)
      if (original.background_asset_id) {
        const newBg = await AssetService.copyAsset(original.background_asset_id, userId); // Need to pass tx in real implementation
        await tx.screens.update({ where: { id: newScreen.id }, data: { background_asset_id: newBg.id } });
      }
      
      // ... similar for guide_asset_id

      return newScreen;
    });
  }
}
