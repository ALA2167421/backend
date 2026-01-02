import { Request, Response } from 'express';
import prisma from '../services/base.service';

export class UserController {
  static async index(req: Request, res: Response) {
    try {
      const users = await prisma.users.findMany();
      res.json({ success: true, data: users });
    } catch (e) { res.status(500).json({ success: false, error: e }); }
  }

  static async create(req: Request, res: Response) {
    try {
      const newUser = await prisma.users.create({ data: req.body });
      res.json({ success: true, data: newUser });
    } catch (e) { res.status(500).json({ success: false, error: e }); }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await prisma.users.update({ where: { id: Number(req.params.id) }, data: req.body });
      res.json({ success: true, data: updated });
    } catch (e) { res.status(500).json({ success: false, error: e }); }
  }

  static async delete(req: Request, res: Response) {
    try {
      await prisma.users.delete({ where: { id: Number(req.params.id) } });
      res.json({ success: true });
    } catch (e) { res.status(500).json({ success: false, error: e }); }
  }
}
