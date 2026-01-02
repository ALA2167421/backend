import { Request, Response } from 'express';
import prisma from '../services/base.service';

export class ProjectController {
  static async index(req: Request, res: Response) {
    // Mock data or DB call
    res.json({ 
        success: true, 
        data: [{ id: 1, name: "Default Project", description: "Main Content Project", baseStyle: "Default" }] 
    });
  }
  static async get(req: Request, res: Response) {
    res.json({ success: true, data: { id: 1, name: "Default Project" } });
  }
  static async update(req: Request, res: Response) {
    res.json({ success: true, data: req.body });
  }
  static async join(req: Request, res: Response) {
    res.json({ success: true });
  }
  static async depart(req: Request, res: Response) {
    res.json({ success: true });
  }
}
