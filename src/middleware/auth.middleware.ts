import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user info
declare global {
  namespace Express {
    interface Request {
      user?: any;
      project?: any;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  // Expecting format: "Bearer <token>" or just "<token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    // --- Mock Token Validation Logic (Legacy Sim) ---
    // In previous step we made token = base64(id:login:timestamp)
    
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');

    if (parts.length < 3) {
        throw new Error("Invalid token format");
    }

    const [userId, login, timestamp] = parts;

    // Optional: Check timestamp expiration (e.g., 24 hours)
    // const tokenTime = parseInt(timestamp);
    // if (Date.now() - tokenTime > 86400000) throw new Error("Token expired");

    // Inject user info into request
    req.user = { id: parseInt(userId), login: login };
    
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};