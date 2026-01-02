import { Request, Response } from 'express';
import { LessonService } from '../services/lesson.service';
import prisma from '../lib/prisma'; // Use singleton instance

export class LessonController {
  
  // List all lessons
  static async index(req: Request, res: Response) {
    try {
      // Simple fetch without relations to test basic connectivity
      const lessons = await prisma.lessons.findMany({ 
          orderBy: { id: 'desc' },
          take: 100 // Limit results initially to prevent overflow
      });
      
      res.json({ success: true, data: lessons });
    } catch (e: any) {
      console.error("❌ ERROR fetching lessons:", e); // Log to server console
      res.status(500).json({ success: false, message: "Server Error", error: e.message || e });
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
    } catch (e: any) {
      console.error("❌ ERROR fetching lesson details:", e);
      res.status(500).json({ success: false, error: e.message || e });
    }
  }

  // Create
  static async create(req: Request, res: Response) {
    try {
      const newLesson = await prisma.lessons.create({
        data: { ...req.body, created_at: new Date(), updated_at: new Date() }
      });
      res.json({ success: true, data: newLesson });
    } catch (e: any) {
      console.error("❌ ERROR creating lesson:", e);
      res.status(500).json({ success: false, error: e.message || e });
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
    } catch (e: any) {
      console.error("❌ ERROR updating lesson:", e);
      res.status(500).json({ success: false, error: e.message || e });
    }
  }

  // Delete
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.lessons.delete({ where: { id: Number(id) } });
      res.json({ success: true });
    } catch (e: any) {
      console.error("❌ ERROR deleting lesson:", e);
      res.status(500).json({ success: false, error: e.message || e });
    }
  }
}