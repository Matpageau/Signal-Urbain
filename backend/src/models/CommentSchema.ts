import mongoose, { Schema, Types } from "mongoose";
import { iCommentValues } from "./Comment";

const commentSchema = new Schema<iCommentValues>({
  report_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true
  }
})

const CommentModel = mongoose.model('Comment', commentSchema);
export default CommentModel;