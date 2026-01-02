import { Request, Response } from 'express';
import prisma from '../services/base.service';

export class AssessmentController {
  static async index(req: Request, res: Response) {
    // Return mock data if DB table doesn't exist yet, or fetch from DB
    res.json({ 
        success: true, 
        data: [
            { id: 1, type: "Multiple Choice", question: "Sample Question 1?", answers: "A, B" },
            { id: 2, type: "True/False", question: "Is this working?", answers: "True" }
        ] 
    });
  }
}
