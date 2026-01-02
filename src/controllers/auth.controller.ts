import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { UserService } from '../services/user.service';

export class AuthController extends BaseController {
  
  async login(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      
      if (!login || !password) {
          return this.sendError(res, "Missing credentials", 400);
      }

      const user = await UserService.authenticate(login, password);
      
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

      // Generate a Mock Token (In production use JWT)
      const token = Buffer.from(`${user.id}:${user.login}:${Date.now()}`).toString('base64');

      this.sendSuccess(res, { 
          user: { 
              id: user.id, 
              firstName: user.first_name, 
              lastName: user.last_name, 
              email: user.email,
              role: user.base_role
          }, 
          token 
      });
    } catch (e) { this.sendError(res, e); }
  }

  async logout(req: Request, res: Response) {
    // Stateless logout (client handles token removal)
    this.sendSuccess(res, null, 'Logged out successfully');
  }
}