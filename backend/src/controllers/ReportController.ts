import { Express, Request, Response, NextFunction } from 'express';
import Report, { iReportValues } from '../models/Report';
import Comment from '../models/Comment';
import createError from '../utils/Error';
import { create } from 'domain';

const reportController = {

  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const errorMessages = [];
      const incReportData: iReportValues = req.body;

      if (!incReportData.category)
        errorMessages.push(createError("A category is required.", 400, "CATEGORY_REQUIRED"));
      else if (!incReportData.description && incReportData.description.trim() === "")
        errorMessages.push(createError("A small report description is required.", 400, "DESCRIPTION_REQUIRED"));
      else if (!incReportData.long && !incReportData.lat)
        errorMessages.push(createError("A geolocatisation is required.", 400, "POSITION_REQUIRED"))
      else if (incReportData.medias.length < 1)
        errorMessages.push(createError("At least one image is required.", 400, "MEDIA_REQUIRED"));
      
      if (errorMessages.length > 0)
        throw errorMessages;
            
      const newReport = await Report.createReport(incReportData);
      res.status(201).json(newReport);

    } catch (error) {
      next(error)
    }
  },
  

  async getAllReport(req: Request, res: Response, next: NextFunction) {
    try {
      const errorMessages = [];
      const dbReports = await Report.findAllReports();

      // Validation
      if (!dbReports || dbReports.length === 0) {
        errorMessages.push(createError("There was no report found.", 404, "NO_REPORT_FOUND"));			
        throw errorMessages;
      }

      res.status(200).json(dbReports);

    } catch (error) {
      next(error)
    }
  },
  

  async getReport(req: Request, res: Response, next: NextFunction) {
    try {
      const errorMessages = [];
      const { id } = req.params;

      if (typeof id !== 'string') {
        return next(createError("userId provided is invalid.", 400, "INVALID_QUERY_PARAMS"))
      }
      const dbReport = await Report.findReportById(id);

      if (!dbReport) {
        errorMessages.push(createError("The id provided did not match any report.", 404, "REPORT_NOT_FOUND"));
        throw errorMessages;
      }

      res.status(200).json(dbReport);

    } catch (error) {
      next(error)
    }
  },


  async getUpvotedReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id?.toString();
      if (!userId) 
        return next(createError("Invalid user id/credential.", 400, "INVALID_ID"));
      
      const userUpvoteList = await Report.findUpvotedList(userId);

      res.status(200).json(userUpvoteList);

    } catch (error) {
      next(error);
    }
  },

  async updateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const errorMessages = [];
      const { reportId } = req.params;
      if (!reportId)
        errorMessages.push(createError("The report ID is invalid.", 400, "REPORT_ID_INVALID"));
        
      const incStatus = req.body.status;
      if (!incStatus)
        errorMessages.push(createError("The status body is invalid.", 400, "INVALID_REPORT_STATUS"));

      const updatedReport = await Report.updateReportStatusById(reportId, incStatus)
      res.status(200).json(updatedReport)

    } catch (error) {
      next(error);
    }
  },

  
  async upvoteReport(req: Request, res: Response, next: NextFunction) { 
    try {
      const user = req.user;
      const userId = user && user._id;
      const { reportId } = req.params;
      
      if (!userId || !reportId || typeof userId !== 'string' || typeof reportId !== 'string') {
        return next(createError(
          "The user ID and/or the report ID are invalid.", 400, "INVALID_QUERY_PARAMS"
        ));
      }

      const updates = await Report.upvoteReport(userId, reportId);
      res.status(202).json(updates)
      
    } catch (error) {
      next(error);
    }
  },

  async deleteReport(req: Request, res: Response, next: NextFunction) { 
    try {
      const { reportId } = req.query;

      if (typeof reportId !== 'string') {
        return next(createError(
          "userId and/or reportId are invalid.", 400, "INVALID_QUERY_PARAMS"
        ));
      }
      await Report.deleteReportById(reportId);

      res.status(200).json(`The report with id of ${reportId} was found and successfully deleted.`);
    
    } catch (error) {
      next(error);
    }
  },

  // Comments features
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const userId = user && user._id;
      const { reportId } = req.params;
      
      if (!reportId || !userId || typeof userId !== 'string' || typeof reportId !== 'string') 
        return next(createError("The user ID provided is invalid.", 400, "INVALID_ID"));
      
      const { comment } = req.body;
      if (!comment && comment.toTrim() === "") {
        return next(createError("The comment is empty", 400, "COMMENTS_EMPTY"))
      }

      const newComment = await Comment.createComment(userId, reportId, comment);
      res.status(201).json(newComment);
      
    } catch (error) {
      next(error)
    }
  },


  async getReportComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { reportId } = req.params;
      if (!reportId) {
        return next(createError("The report id provided is invalid.", 400, "INVALID__REPORT_ID"));
      }

      const comments = await Comment.findReportComments(reportId);
      return res.status(200).json(comments);
      
    } catch (error) {
      next(error);
    }
  },

  // TODO PATCH REQUEST updateReport()
  // receive req.body
}


export default reportController;