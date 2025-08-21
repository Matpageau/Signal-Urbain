import express from "express";
import UserController from "../controllers/UserController";
import { AuthJWT, isAdmin, isCityAdmin } from "../middlewares/AuthJWT";

const UserRoutes = express.Router();

// http://localhost:3000/api/user/all
UserRoutes.post("/register", UserController.createUser);

// http://localhost:3000/api/user/login
UserRoutes.post("/login", UserController.login);

// http://localhost:3000/api/user/me
UserRoutes.get("/me", AuthJWT, UserController.getUserById)

// TODO GET/followed -> return toute les reports upvoted par un User
// Recoit credential, utilise le REQ.USER
UserRoutes.get("/followed", AuthJWT, UserController.getUpvotedReport)

// http://localhost:3000/api/user/all
UserRoutes.get("/", AuthJWT, isAdmin, UserController.getAllUsers);

// http://localhost:3000/api/user/:id
UserRoutes.delete("/:id", AuthJWT, isAdmin, UserController.deleteUser);

export default UserRoutes;