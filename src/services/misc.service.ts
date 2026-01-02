import prisma from './base.service';

export class SimulationService {
  static async findOne(id: number) { return prisma.simulations.findUnique({ where: { id } }); }
}

export class ReportService {
  static async create(data: any) { return prisma.reports.create({ data }); }
}

export class TagService {
  static async findAll() { return prisma.tags.findMany(); }
}
