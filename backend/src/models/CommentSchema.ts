import mongoose, { Schema } from "mongoose";
import { iCommentValues } from "./Comment";

const commentSchema = new Schema({
  report_id: {
    type: String,
    ref: "Report",
    required: true
  },
  author_id: {
    type: String,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true
  }
}, {timestamps: true})

const CommentModel = mongoose.model('Comment', commentSchema);
export default CommentModel;