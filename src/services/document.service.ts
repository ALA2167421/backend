import prisma, { getNextVersionNumber } from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class DocumentService {

  static async findOne(id: number) {
    return await prisma.documents.findUnique({
      where: { id },
      include: {
        document_versions: { orderBy: { number: 'desc' } }
      }
    });
  }

  static async createVersion(data: any, userId: number) {
    const nextNumber = await getNextVersionNumber('document_versions', 'document_id', data.document_id);

    return await prisma.document_versions.create({
      data: {
        uuid: uuidv4(),
        document_id: data.document_id,
        file_id: data.file_id,
        author_id: userId,
        number: nextNumber,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }

  static async copyDocument(originalDocId: number, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const original = await tx.documents.findUnique({
        where: { id: originalDocId },
        include: { document_versions: { orderBy: { number: 'desc' }, take: 1, include: { files: true } } }
      });

      if (!original) throw new Error("Document not found");

      const newDoc = await tx.documents.create({
        data: {
          uuid: uuidv4(),
          name: `${original.name}_copy_${Date.now()}`,
          type_id: original.type_id,
          status_id: original.status_id,
          category_id: original.category_id,
          author_id: userId,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      const currentVer = original.document_versions[0];
      if (currentVer) {
        let newFileId = currentVer.file_id; 
        if (currentVer.files) {
             const newFile = await tx.files.create({
               data: {
                 uuid: uuidv4(),
                 name: currentVer.files.name,
                 content_type: currentVer.files.content_type,
                 author_id: userId,
                 created_at: new Date(),
                 handler: currentVer.files.handler,
                 action: currentVer.files.action
               }
             });
             newFileId = newFile.id;
        }

        await tx.document_versions.create({
          data: {
            uuid: uuidv4(),
            document_id: newDoc.id,
            number: 1,
            file_id: newFileId,
            author_id: userId,
            created_by: userId,
            updated_by: userId,
            created_at: new Date(),
            updated_at: new Date()
          }
        });
      }
      return newDoc;
    });
  }

  static async deleteDocument(id: number) {
    return await prisma.$transaction([
      prisma.lessons_documents.deleteMany({ where: { document_id: id } }),
      prisma.learning_objects_documents.deleteMany({ where: { document_id: id } }),
      prisma.documents.delete({ where: { id } })
    ]);
  }
}
