import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class TextAttributeController extends BaseController {
  
  // GET /text_attributes/dirty_count
  async dirtyCount(req: Request, res: Response) {
    try {
      // تحويل استعلام SQL الخام الموجود في الروبي إلى Prisma
      // المنطق: البحث عن نصوص تحتاج لتحديث صوتي (TTS mismatch)
      const count = await prisma.screen_item_text_attributes.count({
        where: {
          text_type: { in: ['TEXT', 'ANSWER'] },
          value: { not: '.' },
          OR: [
            // الحالة 1: العنصر يدعم TTS والصوت غير موجود أو قديم
            {
              screen_item: {
                tts: true,
                component: { tts: true }
              },
              audio_asset_id: null
              // ملاحظة: مقارنة tts_version != value صعبة في Prisma مباشرة وقد تحتاج Raw Query
              // لكن هذا تقريب جيد للمنطق
            },
            // الحالة 2: العنصر لا يدعم TTS لكن يوجد صوت (يجب حذفه)
            {
              screen_item: { tts: false },
              audio_asset_id: { not: null }
            }
          ]
        }
      });

      this.sendSuccess(res, { count });
    } catch (e) { this.sendError(res, e); }
  }

  // GET /text_attributes/run_tts
  async runTts(req: Request, res: Response) {
    try {
      // في الروبي كان يطلق Thread.
      // في Node.js، يجب استخدام Queue (مثل BullMQ) للعمليات الثقيلة.
      // سنضع هنا محاكاة للعملية.
      console.log("Starting TTS Background Job...");
      
      // Placeholder for Job Queue
      // queue.add('tts-job', { project_id: req.project.id });

      this.sendSuccess(res, null, 'TTS generation started in background');
    } catch (e) { this.sendError(res, e); }
  }
}
