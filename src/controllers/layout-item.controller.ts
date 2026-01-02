import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';
import { LayoutService } from '../services/layout.service';

export class LayoutItemController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const items = await prisma.layout_items.findMany();
      this.sendSuccess(res, items);
    } catch (e) { this.sendError(res, e); }
  }

  async update(req: Request, res: Response) {
    try {
      const item = await prisma.layout_items.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      this.sendSuccess(res, item);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await LayoutService.deleteLayoutItem(parseInt(req.params.id));
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
