import { Response } from 'express';

export class BaseController {
  protected sendSuccess(res: Response, data: any, message: string = 'Success') {
    return res.status(200).json({ success: true, message, data });
  }

  protected sendError(res: Response, error: any, message: string = 'Internal Server Error') {
    console.error(message, error);
    // منطق prevent_access في الروبي كان يرجع 403 أو نص
    if (error.message === 'Access Denied') {
        return res.status(403).json({ success: false, message: 'Access Denied' });
    }
    return res.status(500).json({ success: false, message, error: error.message });
  }
}
