import express from "express";
import ReportController from "../controllers/ReportController";
import CommentController from "../controllers/CommentController";
import { AuthJWT, isAdmin, isCityAdmin, isUser } from "../middlewares/AuthJWT";

const ReportRoutes = express.Router();

// Post
ReportRoutes.post("/", ReportController.createReport);
ReportRoutes.get("/", ReportController.getAllReport);

ReportRoutes.get("/followed", AuthJWT, ReportController.getUpvotedReport)
ReportRoutes.get("/:reportId/comments", CommentController.getReportComments)

ReportRoutes.post("/:reportId/comments", AuthJWT, CommentController.createComment)


// Patch
ReportRoutes.patch("/:reportId/upvote", AuthJWT, isUser, ReportController.upvoteReport);

// Delete 
ReportRoutes.delete("/:reportId/delete", AuthJWT, isCityAdmin, ReportController.deleteReport);

export default ReportRoutes;