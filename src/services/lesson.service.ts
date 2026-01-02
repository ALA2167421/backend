import prisma from './base.service';

export class LessonService {

  static async findOne(id: number) {
    // 1. جلب الدرس
    const lesson = await prisma.lessons.findUnique({
      where: { id }
    });

    if (!lesson) return null;

    // 2. جلب الكائنات التعليمية
    const learningObjects = await prisma.learning_objects.findMany({
      where: { lesson_id: id },
      orderBy: { sequence: 'asc' }
    });

    // 3. جلب الشاشات
    const loIds = learningObjects.map(lo => lo.id);
    let screens: any[] = [];
    if (loIds.length > 0) {
        screens = await prisma.screens.findMany({
            where: { learning_object_id: { in: loIds } },
            orderBy: { sequence: 'asc' }
        });
    }

    // 4. جلب عناصر الشاشة (Items) + المكونات (Components) يدوياً
    const screenIds = screens.map(s => s.id);
    let items: any[] = [];
    let components: any[] = [];
    
    if (screenIds.length > 0) {
        // أ. جلب العناصر الخام
        items = await prisma.screen_items.findMany({
            where: { screen_id: { in: screenIds } }
        });

        // ب. استخراج معرفات المكونات المطلوبة
        const componentIds = items
            .map(i => i.component_id)
            .filter(id => id != null); // استبعاد القيم الفارغة

        if (componentIds.length > 0) {
            // ج. جلب المكونات
            components = await prisma.components.findMany({
                where: { id: { in: componentIds } }
            });
        }
    }

    // 5. تجميع البيانات (Stitching)
    // دمج المكون داخل العنصر، ثم دمج العنصر داخل الشاشة
    const screensWithItems = screens.map(s => {
        // العناصر الخاصة بهذه الشاشة
        const myItems = items.filter(i => i.screen_id === s.id);
        
        // ربط كل عنصر بالمكون الخاص به
        const myItemsWithComponents = myItems.map(item => {
            return {
                ...item,
                component: components.find(c => c.id === item.component_id)
            };
        });

        return {
            ...s,
            items: myItemsWithComponents
        };
    });

    // نوزع الشاشات (المحملة بالعناصر) على الكائنات
    const learningObjectsWithChildren = learningObjects.map(lo => {
        return {
            ...lo,
            screens: screensWithItems.filter(s => s.learning_object_id === lo.id),
            objectives: [],
            issues: []
        };
    });

    return {
      ...lesson,
      learningObjects: learningObjectsWithChildren,
      lessonSchedules: [],
      lessonDeployments: [],
      lessonsDocuments: [],
      lessonsRolesUsers: []
    };
  }

  static async create(data: any, userId: number) {
    return await prisma.lessons.create({
      data: { ...data, created_by: userId, updated_by: userId, created_at: new Date(), updated_at: new Date() }
    });
  }

  static async deleteLesson(id: number) {
    return await prisma.lessons.delete({ where: { id } });
  }
  
  static async addMember(lessonId: number, userId: number, roleId: number) {
      return { success: true };
  }
}
