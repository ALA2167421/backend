import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class AssetVersionController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      const versions = await prisma.asset_versions.findMany();
      this.sendSuccess(res, versions);
    } catch (e) { this.sendError(res, e); }
  }

  async show(req: Request, res: Response) {
    try {
      const version = await prisma.asset_versions.findUnique({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, version);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await prisma.asset_versions.delete({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
