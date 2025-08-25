import mongoose, { Types } from "mongoose";
import createError from '../utils/Error';
import ReportModel from "./ReportSchema";
import Comment, { iCommentValues } from "./Comment";
import CommentModel from "./CommentSchema";
import { create } from "domain";

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
  _id: string | Types.ObjectId | null;
  category: categoryEnum;
  status: statusEnum; 
  description: string;
  long: number;
  lat: number;
  upvote_user_ids: string[] | Types.ObjectId[];
  medias: string[];
}

export default class Report {
  _id: string | Types.ObjectId | null;
  category: categoryEnum;
  status: statusEnum; 
  description: string;
  long: number;
  lat: number;
  upvote_user_ids: string[] | Types.ObjectId[];
  medias: string[];

  constructor({ _id, category, status, description, long, lat, medias}: iReportValues) {
    this._id = _id || null;
    this.category = category;
    this.status = status;
    this.description = description;
    this.long = long;
    this.lat = lat;
    this.upvote_user_ids = [];
    this.medias = medias || [];
  }

  static getClassKeys() {
    return [ "_id", "category", "status", "description", "long", "lat", "upvote_user_ids", "medias"]
  }
  
  /**
   * Use this function with an object of type Report : iReportValues.
   * This async function instanciate and save() a ReportModel.
   * @returns Nothing
   * @throws errorKey : "SAVING_DATA_ERROR"
   */
  async saveReport() {
    try {
      const reportMongoModel = new ReportModel({
        _id: this._id || new Types.ObjectId,
        category: this.category,
        status: this.status,
        description: this.description,
        long: this.long,
        lat: this.lat,
        upvote_user_ids: this.upvote_user_ids,
        medias: this.medias
      });

      return await reportMongoModel.save();
    } catch (error) {
      throw [createError("An error happened during data saving", 500, "SAVING_DATA_ERROR")];
    }
  }

  static async createReport(data: iReportValues) {
    try {
      data.status = statusEnum.CREATED;

      const newReportObj = new Report(data);
      const newReport = await newReportObj.saveReport();
      return newReport.populate('commentCount'); 
      
    } catch (error) {
      throw error;
    }
  }
  
  static async findAllReports() {
    const dbReports = await ReportModel.find().populate('commentCount');

    if (!dbReports || dbReports.length === 0) 
      return [];
    
    return dbReports;
  }

  /**
   * This function seeks a report with an ID. 
   * @param reportId The id of the desired report.
   * @returns A document of the report requested with a "commentCount" or, null if not found.
   */
  static async findReportById(reportId: string): Promise<mongoose.Document | null> {
    // Id's validation
    if (!Types.ObjectId.isValid(reportId)) 
      throw createError("The report ID provided is invalid.", 401, "INVALID_ID"); 

    const dbReport = await ReportModel.findById(reportId).populate('commentCount');
    if (!dbReport) {
      return null;
    }

    return dbReport;
  }


  static async findUpvotedList(limit: number, page: number, userId: string) {

    const reportToSkip = page * limit;
    const totalReports = await ReportModel.countDocuments({ upvote_user_ids: userId });

    const userReportList = await ReportModel.find({ upvote_user_ids: userId })
      .skip(reportToSkip)
      .limit(limit)
      .populate('commentCount');
    
    return {
      reports: userReportList,
      reportsCount: totalReports
    };
  }
  

  static async updateReportStatusById(reportId: string, newStatus: string) {
    const errorMessages = [];
    
    if (!Types.ObjectId.isValid(reportId)) 
      errorMessages.push(createError("The report ID provided is invalid.", 401, "INVALID_ID"));
      
    const updatedReport = await ReportModel.findByIdAndUpdate(
      reportId,
      { status: newStatus },
      { new: true}
    ).populate("commentCount")
    if (!updatedReport) 
      errorMessages.push(createError("The report ID provided is invalid.", 401, "INVALID_ID"));
      
    if (errorMessages.length > 0)
    throw errorMessages; 

    return updatedReport;
  }


  static async upvoteReport(userId: string , reportId: string) {

    // Id's validation
    if (!Types.ObjectId.isValid(userId) && !Types.ObjectId.isValid(reportId)) 
      throw (createError("One of the ID's provided is invalid.", 400, "INVALID_ID"))
    
    const report = await ReportModel.findById(reportId).lean();
    if (!report) 
      throw (createError("The id provided dit not match any report.", 404, "REPORT_NOT_FOUND"))

    const userObjectId = new Types.ObjectId(userId);
    
    // Verifier si le user a deja upvote ce report
    if (report.upvote_user_ids.some((id: any) => id.toString() === userObjectId.toString())) {
      // Remove the upvote_user_id vote
      return await ReportModel.findByIdAndUpdate(
        reportId,
        { $pull: { upvote_user_ids: userObjectId } },
        {new: true}
      ).populate('commentCount');
    
    } else {
      // Add the user vote to the upvote_user_id's list
      return await ReportModel.findByIdAndUpdate(
        reportId,
        { $addToSet: { upvote_user_ids: userObjectId } },
        {new: true}
      ).populate('commentCount');
    }
  }


  static async deleteReportById(reportId: string) {
    const report = await ReportModel.findByIdAndDelete(reportId);
    
    if (!report) {
      throw [createError("The id provided dit not match any report.", 404, "REPORT_NOT_FOUND")];
    }
  }
}