import mongoose, { Types } from "mongoose";
import createError from '../utils/Error';
import ReportModel from "./ReportSchema";
import UserModel from "./UserSchema";

export enum categoryEnum  {
  POTHOLE = 'pothole',
  DMGELEMENT = 'dmgelement',
  ROADOBSTACLE = 'roadobstacle',
  FAULTYLIGHT = 'faultylight',
  DANGEROUSTREE = 'dangeroustree',
  VANDALISM = 'vandalism',
  OTHER = 'other'
}
export enum statusEnum {
  CREATED = 'created',
  INPROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

export interface iReportValues {
  _id: string | null;
  category: categoryEnum;
  status: statusEnum; 
  description: string;
  long: number;
  lat: number;
  upvote: number;
  media: string[] | [];
}

export default class Report {
  _id: string | null;
  category: categoryEnum;
  status: statusEnum; 
  description: string;
  long: number;
  lat: number;
  upvote: number;
  media: string[] | [];

  constructor({ _id, category, status, description, long, lat, upvote, media}: iReportValues) {
    this._id = _id || null;
    this.category = category;
    this.status = status;
    this.description = description;
    this.long = long;
    this.lat = lat;
    this.upvote = upvote;
    this.media = media || [];
  }

  async saveReport(): Promise<void> {
    try {
      const reportValues = new ReportModel({
        category: this.category,
        status: this.status,
        description: this.description,
        long: this.long,
        lat: this.lat,
        upvote: this.upvote,
        media: this.media
      });

      await reportValues.save();
      console.log(`New report with category ${this.category} was saved successfully.`)
    } catch (error) {
      throw error;
    }
  }

  static async createReport(data: iReportValues) {
    const errorMessages = [];

    // Create new instance
    const newReport = new Report(data);
    // Saving to DB
    await newReport.saveReport().then(() => {
      return newReport;

    }).catch((err) => {
      err = errorMessages.push(createError("An error happened during data saving", 401, "SAVING_DATA_ERROR"))
      throw err;
    })
  }

  static async findReportById(id: string): Promise<Report | null> {

    const dbReport = await ReportModel.findById(id);
    if (!dbReport) {
      return null;
    }

    // TODO Must populate the comments 
    return new Report({
        _id: dbReport._id,
        category: dbReport.category,
        status: dbReport.status,
        description: dbReport.description,
        long: dbReport.long,
        lat: dbReport.lat,
        upvote: dbReport.upvote,
        media: dbReport.media
    });
  }

  static async findAllReports(): Promise<Report[]> {
    
    const dbReports = await ReportModel.find();
    if (!dbReports || dbReports.length === 0) {
      return [];
    }
    
    // TODO Must populate the comments
    return dbReports.map((report: any) => new Report({
      _id: report._id,
      category: report.category,
      status: report.status,
      description: report.description,
      long: report.long,
      lat: report.lat,
      upvote: report.upvote,
      media: report.media
    }));
  }

  static async upvoteReport(userId: string, reportId: string) {
    const errorMessages = [];

    // Id's validation
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(reportId)) {
      errorMessages.push(createError("One of the ID's provided is invalid.", 401, "INVALID_ID"))
      throw errorMessages;
    }

    // Finding object in the database
    const report = await ReportModel.findById(reportId);
    if (!report) {
      errorMessages.push(createError("The id provided dit not match any user", 404, "USER_NOT_FOUND"))
      throw errorMessages;
    }
    
    // Updating user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: {upvoted_report_ids: report._id} }, 
      { new: true }
    );
    if (!updatedUser) {
      errorMessages.push(createError("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
      throw errorMessages;
    }

    // Update le report avec findByIdAndUpdate
    const updatedReport = await ReportModel.findByIdAndUpdate(
      reportId,
      { $inc: { upvote: 1 } }
    )
    
    return { user: updatedUser , report: updatedReport }
  }

  static async deleteReportById(reportId: string) {
    const errorMessages = [];
    const report = await ReportModel.findByIdAndDelete(reportId);
    
    if (!report) {
      errorMessages.push(createError("The id provided dit not match any report.", 404, "REPORT_NOT_FOUND"))
      throw errorMessages;
    }
  }
}