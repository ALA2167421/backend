import { Request, Response } from 'express';
export class RoleController {
  static async index(req: Request, res: Response) {
    res.json({ success: true, data: [{ id: 1, name: "Admin" }, { id: 2, name: "Editor" }] });
  }
  static async create(req: Request, res: Response) { res.json({ success: true }); }
  static async update(req: Request, res: Response) { res.json({ success: true }); }
  static async delete(req: Request, res: Response) { res.json({ success: true }); }
}
