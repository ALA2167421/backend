import prisma, { getNextVersionNumber } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class AssetService {

  static async findOne(id: number) {
    return await prisma.assets.findUnique({
      where: { id },
      include: {
        asset_versions: {
          orderBy: { number: 'desc' },
          take: 1, 
          include: { files: true } 
        }
      }
    });
  }

  static async createVersion(data: any, userId: number) {
    const nextNumber = await getNextVersionNumber('asset_versions', 'asset_id', data.asset_id);
    
    return await prisma.asset_versions.create({
      data: {
        uuid: uuidv4(),
        asset_id: data.asset_id,
        file_id: data.file_id,
        source_id: data.source_id,
        author_id: userId,
        number: nextNumber,
        url: data.url, 
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }

  static async copyAsset(originalAssetId: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch original
      const original = await tx.assets.findUnique({
        where: { id: originalAssetId },
        include: { asset_versions: { orderBy: { number: 'desc' }, take: 1, include: { files: true } } }
      });

      if (!original) throw new Error("Asset not found");

      // 2. Generate new name
      let newName = original.name;
      if (newName.includes("_copy")) {
        newName = newName.substring(0, newName.indexOf("_copy"));
      }
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      newName += `_copy_${timestamp}`;

      // 3. Create new Asset
      const newAsset = await tx.assets.create({
        data: {
          uuid: uuidv4(),
          exuid: original.exuid,
          name: newName,
          type_id: original.type_id,
          status_id: original.status_id,
          source_asset_id: original.id, 
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // 4. Copy Latest Version
      const currentVer = original.asset_versions[0];
      if (currentVer) {
        let newFileId = null;
        if (currentVer.file_id && currentVer.files) {
           const newFile = await tx.files.create({
             data: {
               uuid: uuidv4(),
               name: currentVer.files.name,
               content_type: currentVer.files.content_type,
               author_id: userId,
               created_at: new Date(),
               // Map other necessary fields from currentVer.files
               handler: currentVer.files.handler,
               action: currentVer.files.action
             }
           });
           newFileId = newFile.id;
        }

        await tx.asset_versions.create({
          data: {
            uuid: uuidv4(),
            asset_id: newAsset.id,
            number: 1, 
            source_id: currentVer.source_id,
            author_id: userId,
            file_id: newFileId,
            url: currentVer.url,
            created_by: userId,
            updated_by: userId,
            created_at: new Date(),
            updated_at: new Date()
          }
        });
      }

      return newAsset;
    });
  }

  static async deleteAsset(id: number) {
    return await prisma.$transaction([
      prisma.screen_items_assets.deleteMany({ where: { asset_id: id } }),
      prisma.assets.delete({ where: { id } })
    ]);
  }
}
