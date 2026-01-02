import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ScreenItemService } from '../services/screen-item.service';
import prisma from '../services/base.service';

export class ScreenItemController extends BaseController {
  
  async copy(req: Request, res: Response) {
    try {
      const { id } = req.params; // Item ID
      const { screen_id } = req.body; // Target Screen

      const newItem = await ScreenItemService.copy(parseInt(id), parseInt(screen_id), req.user.id);
      this.sendSuccess(res, newItem);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await ScreenItemService.deleteItem(parseInt(req.params.id));
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
