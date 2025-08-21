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

      await reportMongoModel.save();
      
    } catch (error) {
      throw [createError("An error happened during data saving", 500, "SAVING_DATA_ERROR")];
    }
  }

  static async createReport(data: iReportValues) {
    try {
      //TODO Specific error each required report Key value
      
      data.status = statusEnum.CREATED;

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
    
    return dbReports;
  }


  static async findReportById(userId: string) {
    // Id's validation
    if (!Types.ObjectId.isValid(userId)) {
      throw createError("The ID's provided is invalid.", 401, "INVALID_ID");
    }

    const dbReport = await ReportModel.findById(userId).populate('commentCount');
    if (!dbReport) {
      return null;
    }

    return dbReport;
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