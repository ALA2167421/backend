import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { TemplateService } from '../services/template.service';
import prisma from '../services/base.service';

export class TemplateController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const templates = await prisma.templates.findMany({
        where: req.project ? { template_category: { project_id: req.project.id } } : {},
        include: { layout: true }
      });
      this.sendSuccess(res, templates);
    } catch (e) { this.sendError(res, e); }
  }

  async duplicate(req: Request, res: Response) {
    try {
      const newTemplate = await TemplateService.duplicate(parseInt(req.params.id), req.user.id);
      this.sendSuccess(res, newTemplate);
    } catch (e) { this.sendError(res, e); }
  }

  async changeslog(req: Request, res: Response) {
    try {
      const logs = await prisma.templates_change_log.findMany({
        where: { template_id: parseInt(req.params.id) },
        orderBy: { created_at: 'desc' }
      });
      this.sendSuccess(res, logs);
    } catch (e) { this.sendError(res, e); }
  }
}
