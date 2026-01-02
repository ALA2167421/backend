import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import prisma from '../services/base.service';

export class ComponentController extends BaseController {
  
  async index(req: Request, res: Response) {
    try {
      const project = req.project; // تم تعيينه في الـ Auth Middleware
      const components = await prisma.components.findMany();
      
      if (!project) {
        return this.sendSuccess(res, components);
      }

      // تطبيق منطق الفلترة الموجود في الروبي
      // Ruby: c.exclude_from.split(" ").index(project.exuid).nil? && ...
      const filtered = components.filter(c => {
        const excludes = c.exclude_from ? c.exclude_from.split(" ") : [];
        const includes = c.include_in ? c.include_in.split(" ") : [];
        
        const isExcluded = excludes.includes(project.exuid);
        // في الروبي: includes.count == 0 || includes.index(...)
        const isIncluded = includes.length === 0 || includes.includes(project.exuid);

        return !isExcluded && isIncluded;
      });

      this.sendSuccess(res, filtered);
    } catch (e) { this.sendError(res, e); }
  }
}
