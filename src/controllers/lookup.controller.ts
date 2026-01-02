import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class LookupController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      // Includes children (tree structure)
      const lookups = await prisma.lookups.findMany({
        include: { lookups: true } // Assuming self-relation is named 'lookups' by Prisma introspection
      });
      this.sendSuccess(res, lookups);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const lookup = await prisma.lookups.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { lookups: true }
      });
      this.sendSuccess(res, lookup);
    } catch (e) { this.sendError(res, e); }
  }

  async create(req: Request, res: Response) {
    try {
      const lookup = await prisma.lookups.create({ data: req.body });
      this.sendSuccess(res, lookup);
    } catch (e) { this.sendError(res, e); }
  }

  async update(req: Request, res: Response) {
    try {
      const lookup = await prisma.lookups.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      this.sendSuccess(res, lookup);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await prisma.lookups.delete({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
