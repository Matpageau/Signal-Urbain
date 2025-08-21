import mongoose, { Schema } from "mongoose";
import "../models/CommentSchema"; //Retirer quand tu vas créer des comments

const reportSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  upvote_user_ids: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    default: []
  },
  medias: {
    type: [String],
    required: false,
  }
});

reportSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'report_id',
  count: true
})

const ReportModel = mongoose.model('Report', reportSchema);
export default ReportModel;
