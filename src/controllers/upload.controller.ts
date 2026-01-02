import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { UploadService } from '../services/upload.service';
import prisma from '../services/base.service';
import fs from 'fs';

export class UploadController extends BaseController {
  
  // POST /uploads
  async create(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error("No file uploaded");

      const upload = await UploadService.create({
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype
      }, req.user.id);

      // Handle specific upload handlers passed in body (simulating Ruby's logic)
      if (req.body.uploadHandler && req.body.uploadAction) {
         console.log(`Executing Handler: ${req.body.uploadHandler}.${req.body.uploadAction}`);
         // Logic to call other services based on handler name would go here
      }

      this.sendSuccess(res, upload);
    } catch (e) { this.sendError(res, e); }
  }

  // GET /uploads/:id/download
  async download(req: Request, res: Response) {
    try {
      const file = await prisma.files.findUnique({ where: { id: parseInt(req.params.id) } });
      
      if (!file || !file.path) return res.status(404).send('File not found');
      
      // التحقق من وجود الملف فعلياً
      if (!fs.existsSync(file.path)) return res.status(404).send('Physical file missing');

      // إرسال الملف (Express يقوم بالمهمة بذكاء بدلاً من X-Sendfile يدوياً)
      res.download(file.path, file.name); 
      
    } catch (e) { this.sendError(res, e); }
  }
}
