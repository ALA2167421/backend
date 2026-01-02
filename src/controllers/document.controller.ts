import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { DocumentService } from '../services/document.service';

export class DocumentController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      // هنا نحتاج لمنطق جلب الكل، سنستخدم Prisma مباشرة للسرعة
      const docs = await DocumentService.findOne(0); // Placeholder logic
      this.sendSuccess(res, docs);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const doc = await DocumentService.findOne(parseInt(req.params.id));
      this.sendSuccess(res, doc);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await DocumentService.deleteDocument(parseInt(req.params.id));
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
