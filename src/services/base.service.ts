import prisma from '../lib/prisma';

// Helper: Calculate next version number
export async function getNextVersionNumber(
  table: 'asset_versions' | 'document_versions',
  parentIdField: 'asset_id' | 'document_id',
  parentId: number
): Promise<number> {
  // @ts-ignore: Dynamic table access
  const result = await (prisma as any)[table].aggregate({
    _max: { number: true },
    where: { [parentIdField]: parentId }
  });
  return (result._max.number || 0) + 1;
}

export default prisma;