import express from "express";
import ReportController from "../controllers/ReportController";
import { AuthJWT, isAdmin, isCityAdmin, isUser } from "../middlewares/AuthJWT";

const ReportRoutes = express.Router();

// Create
ReportRoutes.post("/", ReportController.createReport);

// Get
ReportRoutes.get("/", ReportController.getAllReport);

// TODO GET/followed -> return toute les reports upvoted par un User
// Recoit credential, utilise le REQ.USER
ReportRoutes.get("/followed", AuthJWT, ReportController.getUpvotedReport)

// Patch
ReportRoutes.patch("/:reportId/upvote", AuthJWT, isUser, ReportController.upvoteReport);

// Delete 
ReportRoutes.delete("/delete/:id", AuthJWT, isCityAdmin, ReportController.deleteReport);

export default ReportRoutes;