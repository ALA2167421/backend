import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class ToolController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      const tools = await prisma.tools.findMany();
      this.sendSuccess(res, tools);
    } catch (e) { this.sendError(res, e); }
  }
}
