import { Request, Response, NextFunction } from 'express';
import Comment, { iCommentValues } from '../models/Comment';
import createError from '../utils/Error';

const commentController = {
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const userId = user && user._id;
      const { reportId } = req.params;
      
      if (!reportId || !userId || typeof userId !== 'string' || typeof reportId !== 'string') 
        return next(createError("The user ID provided is invalid.", 400, "INVALID_ID"));
      
      const { comment } = req.body;
      if (!comment && comment.toTrim() === "") {
        return next(createError("The comment is empty", 400, "COMMENTS_EMPTY"))
      }

      const newComment = await Comment.createComment(userId, reportId, comment);
      res.status(201).json(newComment);
      
    } catch (error) {
      next(error)
    }
  },


  async getReportComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      if (!reportId) {
        return next(createError("The report id provided is invalid.", 400, "INVALID__REPORT_ID"));
      }

      const comments = await Comment.findReportComments(reportId);
      return res.status(200).json(comments);
      
    } catch (error) {
      next(error);
    }
  },
}

export default commentController;