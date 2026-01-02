import prisma from './base.service';

export class LookupService {
  static async findAllByType(type: string) {
    return await prisma.lookups.findMany({
      where: { lookup_type: type },
      orderBy: { value: 'asc' }
    });
  }

  static async findById(id: number) {
    return await prisma.lookups.findUnique({ where: { id } });
  }
}
