import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { iUserValues } from "../models/User";
import createError from "../utils/Error";

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

      // TODO Verif du role

      next()
    })
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next([createError("The token has expired", 401, "TOKEN_EXPIRED")])
    }
    if (error !instanceof createError) {
      return next([createError("Error happened during authentication", 500, "AUTH_SERVER_ERROR")] )
    }
    console.log(` ERROR IS : ${error} `)
    next(error);
  }
}

// TODO Roles Middlewares
// export const requireCityAdmin = (req: Request, res: Response, next: NextFunction) => {
//   if(req.user?.role == UserRoleEnum.CITYADMIN) {
//     next()
//   }
//   next(error)
// }

// export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
//   if(req.user?.role == UserRoleEnum.ADMIN) {
//     next()
//   }
//   next(error)
// }

