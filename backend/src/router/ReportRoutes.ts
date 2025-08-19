import express from "express";
import ReportController from "../controllers/ReportController";

const ReportRoutes = express.Router();

ReportRoutes.post("/create", ReportController.createReport);

ReportRoutes.get("/", ReportController.getAllReport);

ReportRoutes.patch("/upvote", ReportController.upvoteReport);

export default ReportRoutes;