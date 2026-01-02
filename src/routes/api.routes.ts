import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.middleware';

// Import All Controllers
import { AuthController } from '../controllers/auth.controller';
import { AssetController } from '../controllers/asset.controller';
import { AssetVersionController } from '../controllers/asset-version.controller';
import { AssessmentController } from '../controllers/assessment.controller';
import { DocumentController } from '../controllers/document.controller';
import { EducationStandardController } from '../controllers/education-standard.controller';
import { GlossaryTermController } from '../controllers/glossary-term.controller';
import { IssueController } from '../controllers/issue.controller';
import { LayoutController } from '../controllers/layout.controller';
import { LayoutItemController } from '../controllers/layout-item.controller';
import { LearningObjectController } from '../controllers/learning-object.controller';
import { LessonController } from '../controllers/lesson.controller';
import { LookupController } from '../controllers/lookup.controller';
import { ObjectiveController } from '../controllers/objective.controller';
import { ProjectController } from '../controllers/project.controller';
import { RoleController } from '../controllers/role.controller';
import { ScreenController } from '../controllers/screen.controller';
import { ScreenItemController } from '../controllers/screen-item.controller';
import { SearchController } from '../controllers/search.controller';
import { TemplateController } from '../controllers/template.controller';
import { TemplateCategoryController } from '../controllers/template-category.controller';
import { TextAttributeController } from '../controllers/text-attribute.controller';
import { ToolController } from '../controllers/tool.controller';
import { UnitController } from '../controllers/unit.controller';
import { UploadController } from '../controllers/upload.controller';
import { UserController } from '../controllers/user.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Buffer storage

// --- Public Routes ---
const authCtrl = new AuthController();
router.post('/login', (req, res) => authCtrl.login(req, res));

// --- Protected Routes ---
router.use(authMiddleware);

// --- Core ---
const projCtrl = new ProjectController();
router.get('/projects', (req, res) => projCtrl.index(req, res));
router.get('/projects/:id', (req, res) => projCtrl.show(req, res));
router.post('/projects', (req, res) => projCtrl.create(req, res));

const lessonCtrl = new LessonController();
router.get('/lessons', (req, res) => lessonCtrl.index(req, res));
router.get('/lessons/:id', (req, res) => lessonCtrl.show(req, res));
router.post('/lessons', (req, res) => lessonCtrl.create(req, res));
router.put('/lessons/:id', (req, res) => lessonCtrl.update(req, res));
router.delete('/lessons/:id', (req, res) => lessonCtrl.destroy(req, res));

const loCtrl = new LearningObjectController();
router.get('/learning_objects', (req, res) => loCtrl.index(req, res));
router.get('/learning_objects/:id', (req, res) => loCtrl.show(req, res));

// --- Screens & Items ---
const screenCtrl = new ScreenController();
router.get('/screens', (req, res) => screenCtrl.index(req, res));
router.get('/screens/:id', (req, res) => screenCtrl.show(req, res));
router.put('/screens/:id', (req, res) => screenCtrl.update(req, res));
router.post('/screens/:id/disconnect', (req, res) => screenCtrl.disconnect(req, res));

const itemCtrl = new ScreenItemController();
router.post('/screen_items/:id/copy', (req, res) => itemCtrl.copy(req, res));
router.delete('/screen_items/:id', (req, res) => itemCtrl.destroy(req, res));

// --- Assets & Uploads ---
const assetCtrl = new AssetController();
const uploadCtrl = new UploadController();
router.get('/assets', (req, res) => assetCtrl.index(req, res));
router.post('/assets/upload', upload.single('file'), (req, res) => assetCtrl.upload(req, res));
router.delete('/assets/:id', (req, res) => assetCtrl.destroy(req, res));

router.post('/uploads', upload.single('Filedata'), (req, res) => uploadCtrl.create(req, res));
router.get('/uploads/:id/download', (req, res) => uploadCtrl.download(req, res));

// --- Issues & Comments ---
const issueCtrl = new IssueController();
router.get('/issues/todo', (req, res) => issueCtrl.todo(req, res));
router.post('/issues/create_externally', (req, res) => issueCtrl.createExternally(req, res));
router.put('/issues/:id', (req, res) => issueCtrl.update(req, res));

// --- Templates ---
const tplCtrl = new TemplateController();
router.get('/templates', (req, res) => tplCtrl.index(req, res));
router.post('/templates/:id/duplicate', (req, res) => tplCtrl.duplicate(req, res));

// --- Tools & Utils ---
const textAttrCtrl = new TextAttributeController();
router.get('/text_attributes/dirty_count', (req, res) => textAttrCtrl.dirtyCount(req, res));
router.get('/text_attributes/run_tts', (req, res) => textAttrCtrl.runTts(req, res));

const searchCtrl = new SearchController();
router.get('/search', (req, res) => searchCtrl.index(req, res));

const userCtrl = new UserController();
router.get('/users', (req, res) => userCtrl.index(req, res));
router.post('/users', (req, res) => userCtrl.create(req, res));

const toolCtrl = new ToolController();
router.get('/tools', (req, res) => toolCtrl.index(req, res));

const unitCtrl = new UnitController();
router.get('/units', (req, res) => unitCtrl.index(req, res));
router.get('/units/:id', (req, res) => unitCtrl.show(req, res));
router.post('/units', (req, res) => unitCtrl.create(req, res));

const lookupCtrl = new LookupController();
router.get('/lookups', (req, res) => lookupCtrl.index(req, res));

export default router;
