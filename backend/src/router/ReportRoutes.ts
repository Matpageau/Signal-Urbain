import express from "express";
import ReportController from "../controllers/ReportController";
import { AuthJWT } from "../middlewares/AuthJWT";

const ReportRoutes = express.Router();

// Create
ReportRoutes.post("/", ReportController.createReport);

// Get
ReportRoutes.get("/", ReportController.getAllReport);
ReportRoutes.get("/:id", ReportController.getReport);

// Patch
// TODO ADD Role authentication 
ReportRoutes.patch("/:reportId/upvote", AuthJWT, ReportController.upvoteReport);

// Delete 
// TODO ADD Role authentication 
ReportRoutes.delete("/delete/:id", AuthJWT, ReportController.deleteReport);

export default ReportRoutes;