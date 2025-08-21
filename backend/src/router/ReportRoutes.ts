import express from "express";
import ReportController from "../controllers/ReportController";
import { AuthJWT, isAdmin, isCityAdmin, isUser } from "../middlewares/AuthJWT";

const ReportRoutes = express.Router();

// Create
ReportRoutes.post("/", ReportController.createReport);

// Get
ReportRoutes.get("/", ReportController.getAllReport);

ReportRoutes.get("/:reportId/comments", ReportController.getReportComments)

ReportRoutes.get("/followed", AuthJWT, ReportController.getUpvotedReport)


// Patch
ReportRoutes.patch("/:reportId/upvote", AuthJWT, isUser, ReportController.upvoteReport);

// Delete 
ReportRoutes.delete("/delete/:id", AuthJWT, isCityAdmin, ReportController.deleteReport);

export default ReportRoutes;