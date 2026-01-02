import { Request, Response } from 'express';
export class UnitController {
  static async index(req: Request, res: Response) {
    res.json({ success: true, data: [{ id: 1, name: "Unit 1", description: "Introduction" }] });
  }
  static async create(req: Request, res: Response) { res.json({ success: true }); }
  static async update(req: Request, res: Response) { res.json({ success: true }); }
  static async delete(req: Request, res: Response) { res.json({ success: true }); }
  static async import(req: Request, res: Response) { res.json({ success: true }); }
}
