# 1. إنشاء ReportController.ts
$reportCtrl = @'
import { Request, Response } from 'express';

export class ReportController {
  
  // List available reports
  static async index(req: Request, res: Response) {
    // Mock Data for now
    res.json({ 
        success: true, 
        data: [
            { id: 1, name: "System Usage Report", description: "User activity logs" },
            { id: 2, name: "Content Progress Report", description: "Lesson completion status" },
            { id: 3, name: "Standards Coverage", description: "Mapping of standards to content" }
        ] 
    });
  }

  // Run a report (Mock generation)
  static async run(req: Request, res: Response) {
    try {
        const { reportId, format } = req.body;
        
        // In a real app, this would use JasperReports or PDFKit
        // Here we send a dummy text file as a "Report"
        const dummyContent = `Report ID: ${reportId}\nGenerated on: ${new Date().toISOString()}\nFormat: ${format}\n\nThis is a sample generated report.`;
        
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="report_${reportId}.txt"`);
        res.send(dummyContent);
        
    } catch (e) {
        res.status(500).json({ success: false, error: "Failed to generate report" });
    }
  }
}
'@
Set-Content "src\controllers\report.controller.ts" $reportCtrl -Encoding UTF8


# 2. تحديث routes.ts لإضافة مسارات التقارير
$routesPath = "src\routes.ts"
$routesContent = Get-Content $routesPath -Raw

# إضافة الاستيراد إذا لم يكن موجوداً
if ($routesContent -notmatch "ReportController") {
    $routesContent = "import { ReportController } from './controllers/report.controller';`n" + $routesContent
    
    # إضافة المسارات قبل "export default"
    $reportRoutes = @'
// Reports
router.get('/reports', ReportController.index);
router.post('/reports/run', ReportController.run);

export default router;
'@
    $routesContent = $routesContent -replace "export default router;", $reportRoutes
    Set-Content $routesPath $routesContent -Encoding UTF8
    
    Write-Host "✅ تم إضافة مسارات التقارير (Reports Routes) بنجاح!" -ForegroundColor Green
} else {
    Write-Host "⚠️ مسارات التقارير موجودة بالفعل." -ForegroundColor Yellow
}