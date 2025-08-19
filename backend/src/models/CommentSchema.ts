import mongoose, { Schema } from "mongoose";
import { iCommentValues } from "./Comment";

const commentSchema = new Schema<iCommentValues>({
  report_id: {
    type: String,
    required: true
  },
  author_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  }
})

const CommentModel = mongoose.model('Comment', commentSchema);
export default CommentModel;