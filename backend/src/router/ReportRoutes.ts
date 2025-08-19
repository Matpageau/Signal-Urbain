import express from "express";
import ReportController from "../controllers/ReportController";

const ReportRoutes = express.Router();

// Create
ReportRoutes.post("/", ReportController.createReport);

// Get
ReportRoutes.get("/", ReportController.getAllReport);
ReportRoutes.get("/:id", ReportController.getReport);

// Patch
ReportRoutes.patch("/upvote/:id", ReportController.upvoteReport);

// Delete
ReportRoutes.delete("/delete/:id", ReportController.deleteReport);

export default ReportRoutes;