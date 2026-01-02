import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../lib/prisma'; // Ensure correct path to prisma client instance

export class ScreenController extends BaseController {
  
  /**
   * Optimized List: Returns ONLY metadata (Lightweight)
   * Fixes: Browser crash due to loading all items for all screens
   */
  async index(req: Request, res: Response) {
    try {
      const { learning_object_id } = req.query;
      
      const whereClause: any = {};
      
      // Filter by Learning Object (Critical for performance)
      if (learning_object_id) {
          whereClause.learning_object_id = parseInt(learning_object_id as string);
      } else if (req.project) {
          // Fallback: if no specific LO, limit to project (still risky but better)
          whereClause.learning_object = { project_id: req.project.id };
      }

      const screens = await prisma.screens.findMany({
        where: whereClause,
        select: {
            id: true,
            name: true,
            sequence: true,
            exuid: true,
            learning_object_id: true,
            active: true,
            // layout_id: true, // Uncomment if needed for list
            // script: false, // Heavy text fields excluded
            // screen_items: false // CRITICAL: Exclude items from list
        },
        orderBy: { sequence: 'asc' }
      });
      
      this.sendSuccess(res, screens);
    } catch (e) { this.sendError(res, e); }
  }

  /**
   * Get Single Screen: Returns FULL details including items
   */
  async show(req: Request, res: Response) {
    try {
      const screenId = parseInt(req.params.id);
      
      const screen = await prisma.screens.findUnique({
        where: { id: screenId },
        include: { 
            screen_items: {
                orderBy: { zindex: 'asc' }, // Ensure correct layering
                include: {
                    component: true // Include component details (name, type)
                }
            } 
        }
      });

      if (!screen) return this.sendError(res, "Screen not found", 404);
      
      this.sendSuccess(res, screen);
    } catch (e) { this.sendError(res, e); }
  }

  async update(req: Request, res: Response) {
    try {
      const screen = await prisma.screens.update({
        where: { id: parseInt(req.params.id) },
        data: req.body
      });
      this.sendSuccess(res, screen);
    } catch (e) { this.sendError(res, e); }
  }

  async create(req: Request, res: Response) {
      try {
          const { learningObjectId, name, width, height } = req.body;
          // Basic create logic - expand as needed based on schema
          const newScreen = await prisma.screens.create({
              data: {
                  name: name || "New Screen",
                  learning_object_id: parseInt(learningObjectId),
                  layout_id: 0, // Default or required
                  type_id: 1, // Default
                  status_id: 1 // Default
              }
          });
          this.sendSuccess(res, newScreen);
      } catch (e) { this.sendError(res, e); }
  }

  async disconnect(req: Request, res: Response) {
    try {
      const screen = await prisma.screens.update({
        where: { id: parseInt(req.params.id) },
        data: { locked_to_template: false }
      });
      this.sendSuccess(res, screen);
    } catch (e) { this.sendError(res, e); }
  }

  async destroy(req: Request, res: Response) {
    try {
      await prisma.screens.delete({ where: { id: parseInt(req.params.id) } });
      this.sendSuccess(res, null, 'Deleted');
    } catch (e) { this.sendError(res, e); }
  }
}