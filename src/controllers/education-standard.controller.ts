import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { EducationStandardService } from '../services/education-standard.service';
import prisma from '../services/base.service';
import { v4 as uuidv4 } from 'uuid';

export class EducationStandardController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      const standards = await prisma.standards.findMany();
      this.sendSuccess(res, standards);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const standard = await EducationStandardService.findOne(parseInt(req.params.id));
      this.sendSuccess(res, standard);
    } catch (e) { this.sendError(res, e); }
  }

  async create(req: Request, res: Response) {
    try {
      const standard = await prisma.standards.create({
        data: {
          ...req.body,
          uuid: uuidv4(),
          created_by: req.user.id,
          created_at: new Date()
        }
      });
      this.sendSuccess(res, standard);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await EducationStandardService.deleteStandard(parseInt(req.params.id));
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
