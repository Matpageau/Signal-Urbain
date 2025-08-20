import { Types } from "mongoose";
import createError from '../utils/Error';
import ReportModel from "./ReportSchema";

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
  upvote: number;
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
  upvote: number;
  upvote_user_ids: string[] | Types.ObjectId[];
  medias: string[];

  constructor({ _id, category, status, description, long, lat, upvote, medias}: iReportValues) {
    this._id = _id || null;
    this.category = category;
    this.status = status;
    this.description = description;
    this.long = long;
    this.lat = lat;
    this.upvote = upvote;
    this.upvote_user_ids = [];
    this.upvote_user_ids = [];
    this.medias = medias || [];
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
        upvote: this.upvote,
        upvote_user_ids: this.upvote_user_ids,
        upvote_user_ids: this.upvote_user_ids,
        medias: this.medias
      });

      await reportMongoModel.save();
      
    } catch (error) {
      throw [createError("An error happened during data saving", 500, "SAVING_DATA_ERROR")];
    }
  }

  static async createReport(data: iReportValues) {
    try {
      //TODO Specific error each required report Key value
      
      data.status = statusEnum.CREATED;
      data.upvote += 1;

      const newReport = new Report(data);
      await newReport.saveReport();
      return newReport; 
      
    } catch (error) {
      throw error;
    }
  }
  
  static async findAllReports() {
    const dbReports = await ReportModel.find().populate('commentCount');
    if (!dbReports || dbReports.length === 0) {
      return [];
    }
    
    const reportMap = dbReports.map((report: any) => ({
      ...new Report({
        _id: report._id,
        category: report.category,
        status: report.status,
        description: report.description,
        long: report.long,
        lat: report.lat,
        upvote: report.upvote,
        upvote_user_ids: report.upvote_user_ids,
        medias: report.medias
      }),
      commentCount: report.commentCount
    }));

    return reportMap;
  }

  static async findReportById(userId: string): Promise<Report | null> {
    const errorMessages = [];

    // Id's validation
    if (!Types.ObjectId.isValid(userId)) {
      errorMessages.push(createError("One of the ID's provided is invalid.", 401, "INVALID_ID"))
      throw errorMessages;
    }

    const dbReport = await ReportModel.findById(userId);
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
      upvote_user_ids: dbReport.upvote_user_ids,
      medias: dbReport.medias
    });
  }

  // TODO PATCH Request updateReportById()
  static async updateReportById(reportId: string) {

    // Update status
    // Update description
    // Update comment
  }

  static async upvoteReport(userId: string , reportId: string) {

    // Id's validation
    if (!Types.ObjectId.isValid(reportId)) 
      throw (createError("One of the ID's provided is invalid.", 400, "INVALID_ID"))
    
    // Finding the report and user in the database
    const report = await ReportModel.findById(reportId).lean();
    if (!report) 
      throw (createError("The id provided dit not match any report.", 404, "REPORT_NOT_FOUND"))

    // Verifier si le user a deja upvote ce report
    const userObjectId = new Types.ObjectId(userId);

    if (report.upvote_user_ids.some((id: any) => id.toString() === userObjectId.toString())) {
      // Remove the upvote_user_id vote
      await ReportModel.findByIdAndUpdate(
        reportId,
        { $pull: { upvote_user_ids: userObjectId } }
      );
      // Decrement the report upvote count
      return await ReportModel.findByIdAndUpdate(
        reportId,
        { $inc: { upvote: -1 } },
        { new: true }
      )
    
    } else {
      // Add the user vote to the upvote_user_id's list
      await ReportModel.findByIdAndUpdate(
        reportId,
        { $addToSet: { upvote_user_ids: userObjectId } }
      );
      // Increment the report upvote count
      return await ReportModel.findByIdAndUpdate(
        reportId,
        { $inc: { upvote: 1 } },
        { new: true }
      )
    }
  }

  static async deleteReportById(reportId: string) {
    const report = await ReportModel.findByIdAndDelete(reportId);
    
    if (!report) {
      throw [createError("The id provided dit not match any report.", 404, "REPORT_NOT_FOUND")];
    }
  }
}