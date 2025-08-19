import mongoose from "mongoose";
import createError from "../utils/Error";
import CommentModel from "./CommentSchema";

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

  async saveReport() {
    try {
      const commentValues = new CommentModel({
        _id: this._id,
        report_id: this.report_id,
        author_id: this.author_id,
        content: this.content
      })

      await commentValues.save();
      console.log(`A new comment added to the report with id : ${this.report_id} .`)

    } catch (error) {
      throw error;
    }
  } 
  static async findAllComment(){}
}
