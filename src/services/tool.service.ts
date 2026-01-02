import prisma from './base.service';

export class ToolService {
  static async findAll() { return prisma.tools.findMany(); }
}
