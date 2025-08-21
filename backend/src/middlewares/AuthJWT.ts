import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { iUserValues, UserRoleEnum } from "../models/User";
import createError from "../utils/Error";
import { error } from "console";

declare global {
  namespace Express {
    interface Request {
      user?: iUserValues;
    }
  }
}

export const AuthJWT = (req: Request, res: Response, next: NextFunction) => {

  try {

    const token = req.cookies.token;
    if (!token) return next ([createError("Access denied. The token is invalid.", 401, "INVALID_TOKEN")]);
    
    const secret = process.env.PRIV_JWT_CODE;
    if(!secret) return next ([createError("The secret code was not found.", 500, "INVALID_SECRET_CODE")]);
    
    jwt.verify(token, secret as string, (err: any, user: any) => {
      if (err) return next([createError("Error happened during token validation", 401, "TOKEN_NOT_MATCH")]);
      
      req.user = user;
      next()
    })

  } catch (error) {

    if (error instanceof TokenExpiredError) {
      return next([createError("The token has expired", 401, "TOKEN_EXPIRED")])
    }
    if (error !instanceof createError) {
      return next([createError("Error happened during authentication", 500, "AUTH_SERVER_ERROR")] )
    }
    next(error);
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === UserRoleEnum.ADMIN)
    next()
    
  else
    return next([createError("You do not have the permissions.", 401, "IS_NOT_ADMIN")]);  
}

export const isCityAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === UserRoleEnum.CITYADMIN)
    next()
    
  else
    return next([createError("You do not have the permissions.", 401, "IS_NOT_CITYADMIN")]);  
}

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === UserRoleEnum.USER)
    next()
    
  else
    return next([createError("You do not have the permissions.", 401, "IS_NOT_CITYADMIN")]);  
}
