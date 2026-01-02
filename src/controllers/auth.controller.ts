import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { UserService } from '../services/user.service';

export class AuthController extends BaseController {
  
  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const user = await UserService.authenticate(login, password);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // في التطبيق الحقيقي، هنا نرسل JWT Token
      this.sendSuccess(res, { user, token: 'mock-jwt-token-' + user.id });
    } catch (e) { this.sendError(res, e); }
  }

  async logout(req: Request, res: Response) {
    // في الـ Stateless API، الخروج يتم من جانب العميل بمسح التوكن
    this.sendSuccess(res, null, 'Logged out successfully');
  }
}
