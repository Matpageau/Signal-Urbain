import { Express, Request, Response, NextFunction } from 'express';
import Report, { iReportValues } from '../models/Report';
import Comment from '../models/Comment';
import createError from '../utils/Error';

const reportController = {

  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const errorMessages = [];
      const newReportData: iReportValues = req.body;

      if (!newReportData) {
        errorMessages.push(createError("The object values are invalid.", 404, "INVALID_VALUES"))
        throw errorMessages;
      }
      
      const newReport = await Report.createReport(newReportData);
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

    
  async updateReport(req: Request, res: Response, next: NextFunction) {},

  
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

  // TODO PATCH REQUEST updateReport()
}


export default reportController;