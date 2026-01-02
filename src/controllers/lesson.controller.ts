import { Request, Response } from 'express';
import { LessonService } from '../services/lesson.service'; // تأكدنا من وجود هذا في خطوات سابقة
import prisma from '../services/base.service';

export class LessonController {
  
  // List all lessons
  static async index(req: Request, res: Response) {
    try {
      const lessons = await prisma.lessons.findMany({ orderBy: { id: 'desc' } });
      res.json({ success: true, data: lessons });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }

  // Get single lesson
  static async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lesson = await LessonService.findOne(Number(id));
      if (!lesson) {
         res.status(404).json({ success: false, message: "Lesson not found" });
         return;
      }
      res.json({ success: true, data: lesson });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }

  // Create
  static async create(req: Request, res: Response) {
    try {
      const newLesson = await prisma.lessons.create({
        data: { ...req.body, created_at: new Date(), updated_at: new Date() }
      });
      res.json({ success: true, data: newLesson });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }

  // Update
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await prisma.lessons.update({
        where: { id: Number(id) },
        data: { ...req.body, updated_at: new Date() }
      });
      res.json({ success: true, data: updated });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }

  // Delete
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.lessons.delete({ where: { id: Number(id) } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ success: false, error: e });
    }
  }
}
