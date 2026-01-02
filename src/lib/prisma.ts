import { PrismaClient } from '@prisma/client'

// إنشاء العميل بشكل مباشر (هيقرأ الـ .env لوحده)
const prisma = new PrismaClient()

export default prisma