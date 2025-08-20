import express from "express";
import ReportController from "../controllers/ReportController";

const ReportRoutes = express.Router();

// Create
ReportRoutes.post("/", ReportController.createReport);

// Get
ReportRoutes.get("/", ReportController.getAllReport);
ReportRoutes.get("/:id", ReportController.getReport);

// Patch
// TODO ADD Role authentication 
ReportRoutes.patch("/upvote", ReportController.upvoteReport);

// Delete 
// TODO ADD Role authentication 
ReportRoutes.delete("/delete/:id", ReportController.deleteReport);

export default ReportRoutes;