import express from "express";
import ReportController from "../controllers/ReportController";
import { AuthJWT, isAdmin, isCityAdmin, isUser } from "../middlewares/AuthJWT";

const ReportRoutes = express.Router();

// Post
ReportRoutes.post("/", ReportController.createReport);
ReportRoutes.get("/", ReportController.getAllReport);

ReportRoutes.get("/followed", AuthJWT, ReportController.getUpvotedReport);
ReportRoutes.get("/:reportId/comments", ReportController.getReportComments);

ReportRoutes.post("/:reportId/comments", AuthJWT, ReportController.createComment);

// Patch
ReportRoutes.patch("/:reportId/upvote", AuthJWT, isUser, ReportController.upvoteReport);
ReportRoutes.patch("/:reportId/update", AuthJWT, isCityAdmin, ReportController.updateReport);

// Delete 
ReportRoutes.delete("/:reportId/delete", AuthJWT, isCityAdmin, ReportController.deleteReport);

export default ReportRoutes;