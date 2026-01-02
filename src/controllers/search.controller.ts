import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class SearchController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const { search, project, lesson, component } = req.query;
      
      // بناء استعلام ديناميكي
      const whereClause: any = {
        // البحث عن نص داخل items أو attributes (محاكاة Fulltext)
        OR: [
          { script: { contains: search as string } }, // في الجدول الأصلي كان اسمه script أو text
        ]
      };

      // الفلاتر
      if (project) whereClause.screen = { learning_object: { project: { name: project as string } } };
      if (lesson) whereClause.screen = { ...whereClause.screen, learning_object: { lesson: { exuid: lesson as string } } };
      if (component) whereClause.component = { name: component as string };

      const items = await prisma.screen_items.findMany({
        where: whereClause,
        include: { screen: { include: { learning_object: true } } },
        take: 50 // Pagination limit
      });

      this.sendSuccess(res, items);
    } catch (e) { this.sendError(res, e); }
  }
}
