import mongoose, { Schema } from "mongoose";
import { iReportValues } from "./Report";

const reportSchema = new Schema<iReportValues>({
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
  upvote: {
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
