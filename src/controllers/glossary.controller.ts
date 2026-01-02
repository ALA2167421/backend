import { Request, Response } from 'express';
import prisma from '../services/base.service';

export class GlossaryController {
  static async index(req: Request, res: Response) {
    res.json({ 
        success: true, 
        data: [
            { id: 1, term: "API", definition: "Application Programming Interface" },
            { id: 2, term: "React", definition: "A JS library for building UIs" }
        ] 
    });
  }
}
