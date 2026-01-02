import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';
import { ObjectiveService } from '../services/objective.service';

export class ObjectiveController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const projectId = req.project ? req.project.id : undefined;
      const objectives = await prisma.objectives.findMany({
        where: projectId ? { project_id: projectId } : {}
      });
      this.sendSuccess(res, objectives);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const objective = await prisma.objectives.findUnique({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, objective);
    } catch (e) { this.sendError(res, e); }
  }

  async create(req: Request, res: Response) {
    try {
      const objective = await ObjectiveService.create({
        ...req.body,
        project_id: req.project?.id
      }, req.user.id);
      this.sendSuccess(res, objective);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await ObjectiveService.deleteObjective(parseInt(req.params.id));
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
