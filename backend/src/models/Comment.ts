import mongoose, { Types } from "mongoose";
import createError from "../utils/Error";
import CommentModel from "./CommentSchema";
import ReportModel from "./ReportSchema";

export interface iCommentValues {
  _id: string | null;
  report_id: string;
  author_id: string;
  content: string;
}

export default class Comment {
  _id: string | null;
  report_id: string;
  author_id: string;
  content: string;
  
  constructor({ _id, report_id, author_id, content }: iCommentValues) {
    this._id = _id;
    this.report_id = report_id,
    this.author_id = author_id,
    this.content = content
  }

  static async findReportComments(reportId: string): Promise<mongoose.Document[]> {
    // Id's validation
    if (!Types.ObjectId.isValid(reportId)) {
      throw createError("The report ID's provided is invalid.", 401, "INVALID_ID");
    }

    const comments = await CommentModel.find(
      { report_id: reportId },
      "content"
    )
    .populate('author_id', '_id username avatar_url')

    return comments;
  }

  async saveComment() {
    try {
      const commentValues = new CommentModel({
        _id: this._id,
        report_id: this.report_id,
        author_id: this.author_id,
        content: this.content
      })

      return await commentValues.save();

    } catch (error) {
      throw error;
    }
  }

  static async createComment(userId: string, reportId: string, comment: string) {
    // Validate if report exist
    const doReportExist = await ReportModel.findById(reportId);
    if (!doReportExist) 
      throw [createError("The report id provided do not exist.", 404, "REPORT_NOT_FOUND")]

    const newComment = await CommentModel.create({
      report_id: new mongoose.Types.ObjectId(reportId),
      author_id: new mongoose.Types.ObjectId(userId),
      content: comment
    });

    return await newComment.populate("author_id", "_id username avatar_url");
  }
}
