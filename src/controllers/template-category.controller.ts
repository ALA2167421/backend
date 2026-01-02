import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class TemplateCategoryController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      const categories = await prisma.template_categories.findMany({
        where: req.project ? { project_id: req.project.id } : {}
      });
      this.sendSuccess(res, categories);
    } catch (e) { this.sendError(res, e); }
  }
}
