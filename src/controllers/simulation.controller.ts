import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class SimulationController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      const sims = await prisma.simulations.findMany();
      this.sendSuccess(res, sims);
    } catch (e) { this.sendError(res, e); }
  }
}
