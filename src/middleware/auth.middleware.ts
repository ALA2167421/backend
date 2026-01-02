import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import prisma from '../services/base.service';

// توسيع واجهة Request لتشمل المستخدم والمشروع
declare global {
  namespace Express {
    interface Request {
      user?: any;
      project?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // محاكاة استخراج التوكن أو الجلسة
    // في الواقع ستستخدم JWT أو Session ID من الهيدر
    const userId = req.headers['x-user-id'] ? parseInt(req.headers['x-user-id'] as string) : 1; 
    const projectId = req.headers['x-project-id'] ? parseInt(req.headers['x-project-id'] as string) : 1;

    // جلب المستخدم (يمكن تحسينه بالكاش)
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = user;
    
    // جلب المشروع الحالي
    if (projectId) {
      const project = await prisma.projects.findUnique({ where: { id: projectId } });
      req.project = project;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Auth Error' });
  }
};
