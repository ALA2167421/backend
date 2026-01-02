import prisma from '../lib/prisma';

export class LessonService {

  static async findOne(id: number) {
    // 1. Fetch Lesson
    const lesson = await prisma.lessons.findUnique({
      where: { id }
    });

    if (!lesson) return null;

    // 2. Fetch Learning Objects (Plain query)
    const learningObjects = await prisma.learning_objects.findMany({
      where: { lesson_id: id },
      orderBy: { sequence: 'asc' }
    });

    // 3. Fetch Screens for these LOs
    const loIds = learningObjects.map(lo => lo.id);
    let screens: any[] = [];
    
    if (loIds.length > 0) {
        screens = await prisma.screens.findMany({
            where: { learning_object_id: { in: loIds } },
            orderBy: { sequence: 'asc' }
        });
    }

    // 4. Fetch Items & Components manually (Safe mode)
    const screenIds = screens.map(s => s.id);
    let items: any[] = [];
    let components: any[] = [];
    
    if (screenIds.length > 0) {
        // Fetch raw items
        items = await prisma.screen_items.findMany({
            where: { screen_id: { in: screenIds } }
        });

        // Fetch components
        const componentIds = items
            .map(i => i.component_id)
            .filter(cid => cid != null)
            // @ts-ignore
            .filter((v, i, a) => a.indexOf(v) === i); // Unique

        if (componentIds.length > 0) {
            components = await prisma.components.findMany({
                where: { id: { in: componentIds } }
            });
        }
    }

    // 5. Stitching Data
    const screensWithItems = screens.map(s => {
        const myItems = items.filter(i => i.screen_id === s.id);
        const myItemsWithComponents = myItems.map(item => {
            return {
                ...item,
                component: components.find(c => c.id === item.component_id)
            };
        });
        return { ...s, items: myItemsWithComponents };
    });

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