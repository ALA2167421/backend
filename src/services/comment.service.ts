import prisma from './base.service';

export class CommentService {
  
  static async getCommentsForIssue(issueId: number) {
    return await prisma.issue_comments.findMany({
      where: { issue_id: issueId },
      include: { users: true } 
    });
  }
}
