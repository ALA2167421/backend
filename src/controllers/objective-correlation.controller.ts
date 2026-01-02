import { Request, Response } from 'express';
import { BaseController } from './base.controller';

export class ImportController extends BaseController {
  async import(req: Request, res: Response) {
    // TODO: Implement CSV/XML Import Service
    this.sendSuccess(res, null, 'Import logic to be implemented with CSV parser');
  }
}
