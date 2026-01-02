import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';
import { ScreenService } from '../services/screen.service';

export class ScreenController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const screens = await prisma.screens.findMany({
        where: req.project ? { learning_object: { project_id: req.project.id } } : {},
        include: { screen_items: true }
      });
      this.sendSuccess(res, screens);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const screen = await ScreenService.findOne(parseInt(req.params.id));
      this.sendSuccess(res, screen);
    } catch (e) { this.sendError(res, e); }
  }

  async update(req: Request, res: Response) {
    try {
      const screen = await prisma.screens.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      this.sendSuccess(res, screen);
    } catch (e) { this.sendError(res, e); }
  }

  async disconnect(req: Request, res: Response) {
    try {
      const screen = await prisma.screens.update({
        where: { id: parseInt(req.params.id) },
        data: { locked_to_template: false }
      });
      this.sendSuccess(res, screen);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await prisma.screens.delete({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
