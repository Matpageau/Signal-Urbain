import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRoleEnum } from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

export function AuthJWT(requiredRoles: UserRoleEnum[]) {
  
}