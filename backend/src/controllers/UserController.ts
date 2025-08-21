import { Request, Response, NextFunction } from 'express';
import User, { iUserValues, UserRoleEnum } from '../models/User';
import jwt from 'jsonwebtoken';
import createError from '../utils/Error';
import ReportModel from '../models/ReportSchema';
import { Types } from 'mongoose';

const userController = {

	async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const newUserData: iUserValues = req.body;
			newUserData.role = UserRoleEnum.USER;

			const newUser = await User.registerUser(newUserData);
			res.status(201).json(newUser);

		} catch (error) {
			next(error);
		}
	},


	async login(req: Request, res: Response, next: NextFunction) {    
		try {
			const { email, password } = req.body;
			const errorMessages = [];

			if (!email || !password) {
				errorMessages.push(createError("You must provide a valid email and password", 401, "INPUT_INVALID"))
				throw errorMessages;
			}

			const userJsonWebToken = await User.loginUser(email, password);

			if (userJsonWebToken) {
				res.cookie('token', userJsonWebToken.token, {
					httpOnly: true,
					maxAge: 1000 * 60 * 60 * 24
				})
			}

      res.status(200).json(userJsonWebToken.token);
    } catch (error) {
      next(error);
    }
	},
	

	async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const errorMessages = [];
			const dbUsers = await User.findAll();

			// Validation
			if (!dbUsers || dbUsers.length === 0) {				
				errorMessages.push(createError("There was no user found.", 404, "NO_USER_FOUND"));			
				throw errorMessages;
			}

			res.status(200).json(dbUsers);

		} catch (error) {
			next(error);
		}
	},

	
	async getUserById(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user?._id;
			if (!userId) 
				return next(createError("No user id provided.", 400, "INVALID_ID"));

			const userDoc = await User.findUserById(userId.toString());
			if (!userDoc) 
				return next(createError("The id provided dit not match any user.", 404, "USER_NOT_FOUND"));
			
			res.status(200).json(userDoc);

		} catch (error) {
			next(error);
		}
	},


	async getUpvotedReport(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user?._id?.toString();
			if (!userId) 
				return next(createError("No user id provided.", 400, "INVALID_ID"));
			
			const userUpvoteList = User.findUpvotedList(userId);
			res.status(200).json(userUpvoteList);

		} catch (error) {
			next(error);
		}
	},

	// TODO Put request updateUserById()

	async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const id  = req.params.id;
			const user = await User.findUserById(id);

			// Validation
			if (!user) 
				throw [createError("The id provided dit not match any user", 404, "USER_NOT_FOUND")];

			await User.deleteUserById(req.params.id);
			res.status(200).json(`User with id of ${req.params.id} was found and successfully deleted.`);

		} catch (error) {
			next(error);
		}
	}
}

export default userController;