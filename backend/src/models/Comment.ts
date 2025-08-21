import mongoose, { Types } from "mongoose";
import createError from "../utils/Error";
import CommentModel from "./CommentSchema";

export interface iCommentValues {
  _id: string | null;
  report_id: Types.ObjectId;
  author_id: Types.ObjectId;
  content: string;
}

export default class Comment {
  _id: string | null;
  report_id: Types.ObjectId;
  author_id: Types.ObjectId;
  content: string;
  
  constructor({ _id, report_id, author_id, content }: iCommentValues) {
    this._id = _id;
    this.report_id = report_id,
    this.author_id = author_id,
    this.content = content
  }

  async saveReport() {
    try {
      const commentValues = new CommentModel({
        _id: this._id,
        report_id: this.report_id,
        author_id: this.author_id,
        content: this.content
      })

      await commentValues.save();

    } catch (error) {
      throw error;
    }
  } 

  // static async findReportComments(reportId: string) {
  //   return CommentModel.find({ report_Id: reportId })
  //     .populate({
  //       path: 'comments',
  //       populate: { path: 'author_id', select: 'username'}
  //     })
  //   .sort({ createdAt: -1 });
  // }
}
