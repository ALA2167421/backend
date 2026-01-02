import { ReportController } from './controllers/report.controller';
import { Router } from 'express';
import { UserController } from './controllers/user.controller';
import { LessonController } from './controllers/lesson.controller';
import { LearningObjectController } from './controllers/learningObject.controller';
import { AssessmentController } from './controllers/assessment.controller';
import { GlossaryController } from './controllers/glossary.controller';
import { ProjectController } from './controllers/project.controller';
import { UnitController } from './controllers/unit.controller';
import { RoleController } from './controllers/role.controller';

const router = Router();

// Test
router.get('/test', (req, res) => res.json({ message: "API Full Operational" }));

// Auth (Mock)
router.get('/auth/check', (req, res) => res.json({ success: true, user: { id: 1, name: "Admin" } }));
router.post('/auth/login', (req, res) => res.json({ success: true, token: "xyz", user: { id: 1, name: "Admin" } }));
router.post('/auth/logout', (req, res) => res.json({ success: true }));

// Projects
router.get('/projects', ProjectController.index);
router.get('/projects/:id', ProjectController.get);
router.put('/projects/:id', ProjectController.update);
router.post('/projects/:id/join', ProjectController.join);
router.post('/projects/:id/depart', ProjectController.depart);

// Units
router.get('/units', UnitController.index);
router.post('/units', UnitController.create);
router.put('/units/:id', UnitController.update);
router.delete('/units/:id', UnitController.delete);
router.post('/units/import', UnitController.import);

// Roles
router.get('/roles', RoleController.index);
router.post('/roles', RoleController.create);
router.put('/roles/:id', RoleController.update);
router.delete('/roles/:id', RoleController.delete);

// Users
router.get('/users', UserController.index);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

// Lessons
router.get('/lessons', LessonController.index || (LessonController as any).list);
router.get('/lessons/:id', LessonController.show || (LessonController as any).get);
router.post('/lessons', LessonController.create);
router.put('/lessons/:id', LessonController.update);
router.delete('/lessons/:id', LessonController.delete);

// Learning Objects
router.get('/learning-objects', LearningObjectController.index);
router.post('/learning-objects', LearningObjectController.create);
router.put('/learning-objects/:id', LearningObjectController.update);
router.delete('/learning-objects/:id', LearningObjectController.delete);

// Assessments & Glossary
router.get('/assessments', AssessmentController.index);
router.get('/glossary', GlossaryController.index);

// Reports
router.get('/reports', ReportController.index);
router.post('/reports/run', ReportController.run);

export default router;

