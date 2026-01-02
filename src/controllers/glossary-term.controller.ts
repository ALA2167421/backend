import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class GlossaryTermController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      // Glossary terms are linked to LOs which are linked to Project
      const terms = await prisma.learning_object_glossary.findMany({
        where: req.project ? { learning_object: { project_id: req.project.id } } : {}
      });
      this.sendSuccess(res, terms);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const term = await prisma.learning_object_glossary.findUnique({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, term);
    } catch (e) { this.sendError(res, e); }
  }

  async create(req: Request, res: Response) {
    try {
      const term = await prisma.learning_object_glossary.create({
        data: {
          ...req.body,
          created_by: req.user.id,
          created_at: new Date()
        }
      });
      this.sendSuccess(res, term);
    } catch (e) { this.sendError(res, e); }
  }
}
