import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';
import { LearningObjectService } from '../services/learning-object.service';

export class LearningObjectController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const projectId = req.project ? req.project.id : undefined;
      const los = await prisma.learning_objects.findMany({
        where: projectId ? { project_id: projectId } : {},
        include: {
          objectives: true,
          assessments: true,
          standards: true,
          glossaryTerms: true, // Was glossary_terms
          screens: true,
          issues: true
        }
      });
      this.sendSuccess(res, los);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const lo = await LearningObjectService.findOne(parseInt(req.params.id));
      this.sendSuccess(res, lo);
    } catch (e) { this.sendError(res, e); }
  }
}
