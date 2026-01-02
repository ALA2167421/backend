import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Calculate next version number (Replica of next_version_number in Ruby)
export async function getNextVersionNumber(
  table: 'asset_versions' | 'document_versions',
  parentIdField: 'asset_id' | 'document_id',
  parentId: number
): Promise<number> {
  // @ts-ignore: Dynamic table access to avoid strict typing issues during migration
  const result = await prisma[table].aggregate({
    _max: { number: true },
    where: { [parentIdField]: parentId }
  });
  return (result._max.number || 0) + 1;
}

export default prisma;
