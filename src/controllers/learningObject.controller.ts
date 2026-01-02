import { Request, Response } from 'express';
import prisma from '../services/base.service';

export class LearningObjectController {
  
  // Get all LOs
  static async index(req: Request, res: Response) {
    try {
      // Include lookup values if needed (status, type)
      const los = await prisma.learning_objects.findMany({
        orderBy: { id: 'desc' },
        // include: { lesson: true } // Uncomment if you want lesson details
      });
      
      // Map to frontend model structure if necessary
      const formattedLos = los.map(lo => ({
        ...lo,
        // Ensure status/type matches what frontend expects (mocking lookup object if it's just a string/int in DB)
        status: { value: lo.status || "Draft" }, 
        type: { value: lo.type || "Animation" }
      }));

      res.json({ success: true, data: formattedLos });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: "Failed to fetch learning objects" });
    }
  }

  // Create LO
  static async create(req: Request, res: Response) {
    try {
      const { name, type, status, lesson_id } = req.body;
      const newLo = await prisma.learning_objects.create({
        data: {
            name,
            type: type?.value || type, // Handle object or string
            status: status?.value || status,
            lesson_id: lesson_id ? Number(lesson_id) : null,
            created_at: new Date(),
            updated_at: new Date()
        }
      });
      res.json({ success: true, data: newLo });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }

  // Update LO
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, status } = req.body;
      
      const updated = await prisma.learning_objects.update({
        where: { id: Number(id) },
        data: { 
            name, 
            type: type?.value || type,
            status: status?.value || status,
            updated_at: new Date() 
        }
      });
      res.json({ success: true, data: updated });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }

  // Delete LO
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.learning_objects.delete({ where: { id: Number(id) } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }
}
