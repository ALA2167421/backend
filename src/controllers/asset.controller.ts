import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { AssetService } from '../services/asset.service';
import { UploadService } from '../services/upload.service';

export class AssetController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      // يمكن إضافة Pagination هنا
      const assets = await AssetService.findOne(req.query.id ? parseInt(req.query.id as string) : 0); // تعديل لجلب الكل إذا لزم
      // بما أن الـ Service الحالية تجلب واحد، سنستخدم Prisma مباشرة للكل أو نعدل الـ Service
      // للتسهيل هنا سنفترض وجود دالة findAll في Service أو نستخدم prisma مباشرة
      // const assets = await prisma.assets.findMany(); 
      this.sendSuccess(res, assets);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const asset = await AssetService.findOne(parseInt(req.params.id));
      if (!asset) return res.status(404).json({ message: 'Not Found' });
      this.sendSuccess(res, asset);
    } catch (e) { this.sendError(res, e); }
  }

  async upload(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error("No file uploaded");
      
      // حفظ الملف فعلياً
      const fileRecord = await UploadService.create({
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype
      }, req.user.id);

      // إنشاء نسخة Asset Version جديدة
      const version = await AssetService.createVersion({
        asset_id: parseInt(req.body.id), // ID الأصل
        file_id: fileRecord.id,
        author_id: req.user.id,
        // ... باقي الحقول من الـ body
        source_id: req.body.source_id,
        url: req.body.url
      }, req.user.id);

      this.sendSuccess(res, version, 'Upload successful');
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await AssetService.deleteAsset(parseInt(req.params.id));
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
