import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class UnitService {
  static async create(data: any, userId: number) {
    return await prisma.units.create({
      data: {
        ...data,
        uuid: uuidv4(),
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });
  }
}
