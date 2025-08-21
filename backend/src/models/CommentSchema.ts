import mongoose, { Schema } from "mongoose";
import { iCommentValues } from "./Comment";

const commentSchema = new Schema({
  report_id: {
    type: Schema.Types.ObjectId,
    ref: "Report",
    required: true
  },
  author_id: {
    type: Schema.Types.ObjectId,
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