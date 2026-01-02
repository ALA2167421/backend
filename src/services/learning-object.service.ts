import prisma from './base.service';
import { v4 as uuidv4 } from 'uuid';

export class LearningObjectService {

  static async findOne(id: number) {
    return await prisma.learning_objects.findUnique({
      where: { id },
      include: {
        learning_object_designs: true,
        learning_object_custom_xmls: true,
        learning_objects_standards: true,
        learning_objects_documents: true,
        learning_objects_roles_users: true
      }
    });
  }

  static async create(data: any, userId: number) {
    const lesson = await prisma.lessons.findUnique({ where: { id: data.lesson_id } });
    if (!lesson) throw new Error("Lesson required");

    // Generate exuid (Lesson exuid + Type suffix)
    // Note: We need to fetch Type additional info. Assuming passed in data or fetched.
    const exuid = data.exuid || `${lesson.exuid}-${Math.floor(Math.random()*1000)}`; 

    return await prisma.learning_objects.create({
      data: {
        ...data,
        uuid: uuidv4(),
        project_id: lesson.project_id,
        exuid: exuid,
        status_id: data.status_id || 401, // not started
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date(),
        learning_object_designs: { create: { status_id: 401 } } // Create empty design
      }
    });
  }

  static async copy(originalLoId: number, targetLessonId: number, targetTypeId: number | null, userId: number, tx: any = prisma) {
    const original = await tx.learning_objects.findUnique({
      where: { id: originalLoId },
      include: {
        learning_object_designs: true,
        screens: true,
        learning_object_glossary: true,
        learning_objects_roles_users: true
      }
    });

    if (!original) throw new Error("LO not found");

    const targetLesson = await tx.lessons.findUnique({ where: { id: targetLessonId } });
    
    // Create shallow copy
    const newLo = await tx.learning_objects.create({
      data: {
        uuid: uuidv4(),
        lesson_id: targetLessonId,
        project_id: targetLesson.project_id,
        type_id: targetTypeId || original.type_id,
        name: original.name,
        exuid: `${targetLesson.exuid}-${Date.now()}`, // simplified logic
        status_id: original.status_id,
        created_by: userId,
        updated_by: userId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Copy Design
    if (original.learning_object_designs[0]) {
      const d = original.learning_object_designs[0];
      await tx.learning_object_designs.create({
        data: {
          // ... copy design fields
          theme: d.theme,
          primary_objective: d.primary_objective,
          status_id: d.status_id,
          learning_object_id: newLo.id
        }
      });
    }

    // Copy Glossary
    for (const term of original.learning_object_glossary) {
       await tx.learning_object_glossary.create({
         data: {
           term: term.term,
           description: term.description,
           learning_object_id: newLo.id,
           created_by: userId
         }
       });
    }
    
    // Note: Screens copying logic is complex (persistency map, script replacement)
    // It should be implemented here similar to the Ruby 'copy' method logic.
    
    return newLo;
  }

  static async storeCustomXml(loId: number, key: string, xml: string, userId: number) {
    const existing = await prisma.learning_object_custom_xmls.findFirst({
      where: { learning_object_id: loId, key: key }
    });

    if (existing) {
      return await prisma.learning_object_custom_xmls.update({
        where: { id: existing.id },
        data: { xml, updated_by: userId, updated_at: new Date() }
      });
    } else {
      return await prisma.learning_object_custom_xmls.create({
        data: {
          learning_object_id: loId,
          key,
          xml,
          created_by: userId,
          updated_by: userId,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }
  }

  static async deleteLearningObject(id: number) {
     // Manual cleanup of HABTM tables
     return await prisma.$transaction([
       prisma.learning_objects_documents.deleteMany({ where: { learning_object_id: id } }),
       prisma.learning_objects_objectives.deleteMany({ where: { learning_object_id: id } }),
       prisma.learning_objects_assessments.deleteMany({ where: { learning_object_id: id } }),
       prisma.learning_objects_standards.deleteMany({ where: { learning_object_id: id } }),
       prisma.learning_objects_roles_users.deleteMany({ where: { learning_object_id: id } }),
       prisma.learning_objects.delete({ where: { id } })
     ]);
  }
}
