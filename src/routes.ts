import { Router } from 'express';
import { authMiddleware } from './middleware/auth.middleware';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { LessonController } from './controllers/lesson.controller';
import { ScreenController } from './controllers/screen.controller';
// ... other imports

const router = Router();
const authCtrl = new AuthController();
const screenCtrl = new ScreenController();

// === PUBLIC ROUTES (No Auth Required) ===
router.post('/auth/login', (req, res) => authCtrl.login(req, res));
router.get('/test', (req, res) => res.json({ message: "System Online" }));

// === PROTECTED ROUTES (Auth Required) ===
router.use(authMiddleware); // Apply middleware to ALL routes defined below this line

// Auth Actions
router.post('/auth/logout', (req, res) => authCtrl.logout(req, res));
router.get('/auth/check', (req, res) => res.json({ success: true, user: req.user }));

// Lessons
router.get('/lessons', LessonController.index || (LessonController as any).list);
router.get('/lessons/:id', LessonController.show || (LessonController as any).get);
router.post('/lessons', LessonController.create);
router.put('/lessons/:id', LessonController.update);
router.delete('/lessons/:id', LessonController.delete);

// Screens
router.get('/screens', (req, res) => screenCtrl.index(req, res));
router.get('/screens/:id', (req, res) => screenCtrl.show(req, res));
router.put('/screens/:id', (req, res) => screenCtrl.update(req, res));
router.post('/screens', (req, res) => screenCtrl.create(req, res));
router.post('/screens/:id/disconnect', (req, res) => screenCtrl.disconnect(req, res));
router.delete('/screens/:id', (req, res) => screenCtrl.destroy(req, res));

// Users (Management)
router.get('/users', UserController.index);
router.post('/users', UserController.create);
router.put('/users/:id', UserController.update);
router.delete('/users/:id', UserController.delete);

export default router;