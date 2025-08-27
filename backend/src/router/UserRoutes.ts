import express from "express";
import UserController from "../controllers/UserController";
import { AuthJWT, isAdmin, isCityAdmin } from "../middlewares/AuthJWT";
import User from "../models/User";

const UserRoutes = express.Router();

// http://localhost:3000/api/user/all
UserRoutes.post("/register", UserController.createUser);

// http://localhost:3000/api/user/login
UserRoutes.post("/login", UserController.login);
UserRoutes.post("/logout", UserController.logout);

// http://localhost:3000/api/user/me
UserRoutes.get("/me", AuthJWT, UserController.getUserById)

// http://localhost:3000/api/user/all
UserRoutes.get("/", AuthJWT, isAdmin, UserController.getAllUsers);

// http://localhost:3000/api/user/:id
UserRoutes.delete("/:id", AuthJWT, isAdmin, UserController.deleteUser);

export default UserRoutes;