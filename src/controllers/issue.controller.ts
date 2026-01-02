import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { IssueService } from '../services/issue.service';
import prisma from '../services/base.service';
import { v4 as uuidv4 } from 'uuid';

export class IssueController extends BaseController {
  
  // GET /issues/todo
  async todo(req: Request, res: Response) {
    try {
      if (!req.project) return this.sendError(res, new Error("Project required"));
      
      const issues = await prisma.issues.findMany({
        where: {
          lesson: { project_id: req.project.id },
          assignee_id: req.user.id,
          resolved: false // 0 in Ruby, false in Prisma Boolean
        },
        include: { lesson: true, learning_object: true, screen: true },
        orderBy: { priority_id: 'asc' }
      });
      this.sendSuccess(res, issues);
    } catch (e) { this.sendError(res, e); }
  }

  async createExternally(req: Request, res: Response) {
    try {
      const { learning_object_code, screen_code, screen_item_code, summary, description, type_name, priority_name } = req.body;

      // 1. Find LO
      const lo = await prisma.learning_objects.findFirst({ 
        where: { uuid: learning_object_code?.toLowerCase() },
        include: { projects: { include: { projectsUsers: true } }, lessons: true }
      });
      if (!lo) throw new Error("LO not found");

      // 2. Validate Project Membership (Simple check)
      const isMember = await prisma.projects_users.findFirst({
        where: { project_id: lo.project_id, user_id: req.user.id }
      });
      if (!isMember) throw new Error("User not in project");

      // 3. Find Screen & Item
      const screen = await prisma.screens.findFirst({ where: { uuid: screen_code?.toLowerCase(), learning_object_id: lo.id } });
      if (!screen) throw new Error("Screen not found");

      let screenItemId = null;
      if (screen_item_code) {
        const item = await prisma.screen_items.findFirst({ where: { exuid: screen_item_code, screen_id: screen.id } });
        if (item) screenItemId = item.id;
      }

      // 4. Resolve Lookups (Type, Priority, Status) - Mocked IDs for simplicity
      // In real implementation, query 'lookups' table
      const typeId = 1501; // Default Issue Type ID
      const priorityId = 1602; // Default Priority ID
      const statusId = 1501; // Open Status ID

      const issue = await IssueService.create({
        uuid: uuidv4(),
        text: summary,
        description: description,
        lesson_id: lo.lesson_id,
        learning_object_id: lo.id,
        screen_id: screen.id,
        screen_item_id: screenItemId,
        type_id: typeId,
        priority_id: priorityId,
        status_id: statusId,
        author_id: req.user.id,
        assignee_id: req.user.id // Default to self
      }, req.user.id);

      this.sendSuccess(res, issue);
    } catch (e) { this.sendError(res, e); }
  }

  async update(req: Request, res: Response) {
    try {
      const { reason, resolved, ...data } = req.body;
      const issueId = parseInt(req.params.id);

      const issue = await prisma.issues.update({
        where: { id: issueId },
        data: {
          ...data,
          resolved: resolved === 'true' || resolved === true,
          updated_by: req.user.id,
          updated_at: new Date()
        }
      });

      // Add Comment if reason provided
      if (reason) {
        await prisma.issue_comments.create({
          data: {
            uuid: uuidv4(),
            text: reason,
            issue_id: issueId,
            author_id: req.user.id,
            created_by: req.user.id,
            created_at: new Date()
          }
        });
      }

      this.sendSuccess(res, issue);
    } catch (e) { this.sendError(res, e); }
  }
}
