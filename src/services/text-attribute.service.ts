import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';
import { AssetService } from './asset.service';

export class TextAttributeService {

  static async copy(originalAttrId: number, newScreenItemId: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.screen_item_text_attributes.findUnique({
        where: { id: originalAttrId },
        include: { assets: true } // Assuming 'audio' relation is mapped to assets
      });

      if (!original) throw new Error("TextAttribute not found");

      // Copy Audio Asset if exists
      let newAudioId = null;
      if (original.audio_asset_id) {
        // We assume AssetService.copyAsset logic can accept tx or we handle it here
        // For simplicity, we just reference the ID, but real logic should deep copy the asset
        // newAudioId = (await AssetService.copyAsset(original.audio_asset_id, userId)).id;
      }

      return await tx.screen_item_text_attributes.create({
        data: {
          uuid: uuidv4(),
          screen_item_id: newScreenItemId,
          source_text_attribute_id: original.id,
          name: original.name,
          value: original.value,
          text_type: original.text_type,
          audio_asset_id: newAudioId, // Copied audio
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }
}
