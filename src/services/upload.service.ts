import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_ROOT = process.env.UPLOAD_PATH || './uploads';

export class UploadService {

  private static getUploadPath(uniqueName: string, extension: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return path.join(UPLOAD_ROOT, `${year}`, `${month}`, `${day}`, `${uniqueName}.${extension}`);
  }

  static async create(fileData: { originalName: string, buffer: Buffer, mimeType: string }, userId: number) {
    return await prisma.$transaction(async (tx) => {
      const uuid = uuidv4();
      const extension = fileData.originalName.split('.').pop() || '';
      const filePath = this.getUploadPath(uuid, extension);
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Write file to disk
      await fs.writeFile(filePath, fileData.buffer);

      // Save metadata to DB
      return await tx.files.create({
        data: {
          uuid: uuid,
          name: fileData.originalName, // Logic to clean name can be added here
          content_type: fileData.mimeType,
          size: fileData.buffer.length,
          path: filePath,
          author_id: userId,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    });
  }

  static async copy(originalFileId: number, userId: number) {
    const original = await prisma.files.findUnique({ where: { id: originalFileId } });
    if (!original || !original.path) throw new Error("File not found or missing path");

    try {
      const fileBuffer = await fs.readFile(original.path);
      return await this.create({
        originalName: original.name,
        buffer: fileBuffer,
        mimeType: original.content_type
      }, userId);
    } catch (e) {
      console.error("Failed to copy physical file", e);
      return null;
    }
  }

  static async deleteFile(id: number) {
    const file = await prisma.files.findUnique({ where: { id } });
    if (file && file.path) {
      try {
        await fs.unlink(file.path);
      } catch (e) {
        console.warn("Could not delete physical file", file.path);
      }
    }
    return await prisma.files.delete({ where: { id } });
  }
}
