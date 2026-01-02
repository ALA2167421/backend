import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';
import { v4 as uuidv4 } from 'uuid';

export class CommentController extends BaseController {
  async index(req: Request, res: Response) {
    try {
      const comments = await prisma.issue_comments.findMany();
      this.sendSuccess(res, comments);
    } catch (e) { this.sendError(res, e); }
  }

  async create(req: Request, res: Response) {
    try {
      const comment = await prisma.issue_comments.create({
        data: {
          ...req.body,
          uuid: uuidv4(),
          author_id: req.user.id,
          created_by: req.user.id,
          created_at: new Date()
        }
      });
      this.sendSuccess(res, comment);
    } catch (e) { this.sendError(res, e); }
  }

  async update(req: Request, res: Response) {
    try {
      const comment = await prisma.issue_comments.update({
        where: { id: parseInt(req.params.id) },
        data: {
          ...req.body,
          updated_by: req.user.id,
          updated_at: new Date()
        }
      });
      this.sendSuccess(res, comment);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await prisma.issue_comments.delete({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}
