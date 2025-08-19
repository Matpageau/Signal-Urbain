import { Request, Response, NextFunction } from 'express';
import Report, { iReportValues } from '../models/Report';
import createError from '../utils/Error';
import User from '../models/User';

const reportController = {

  async createReport(req: Request, res: Response, next: NextFunction) {
    try {
      const newReportData: iReportValues = req.body;

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

  async upvoteReport(req: Request, res: Response, next: NextFunction) { 
    try {

      const { userId, reportId } = req.params;
      const updates = await Report.upvoteReport(userId, reportId)
      
      res.status(202).json(updates)
      
    } catch (error) {
      next(error);
    }
  },

  async deleteReport(req: Request, res: Response, next: NextFunction) { 
    try {

      const { id } = req.params;
      await Report.deleteReportById(id);

      res.status(200).json(`User with id of ${id} was found and successfully deleted.`);
    
    } catch (error) {
      next(error);
    }
  },
}

export default reportController;