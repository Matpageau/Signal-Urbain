import { Request, Response, NextFunction } from 'express';
import User, { iUserValues, UserRoleEnum } from '../models/User';
import jwt from 'jsonwebtoken';
import createError from '../utils/Error';

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


	async getByToken(req: Request, res: Response, next: NextFunction) {
		try {
			const errorMessages = [];
			const token = req.cookies.token;
      
			if (!token) {
				errorMessages.push(createError("There is no token provided.", 401, "TOKEN_MISSING"))
			}
			
			const secret = process.env.PRIV_JWT_CODE
			const decodedToken = jwt.verify(token, secret!) as { _id: string }

			if (!decodedToken._id) {
				errorMessages.push(createError("The token provided is invalid.", 401, "TOKEN_INVALID"))
			}
			
			const user = await User.findUserById(decodedToken._id);
			if (!user) {
				errorMessages.push(createError("The user could not be found with this token.", 404, "USER_NOT_FOUND"))
			}

			if (errorMessages.length > 0) {
        throw errorMessages;
      }

			res.status(200).send(user);
	
		} catch (error) {
			next(error)
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
			const errorMessages = [];
			const dbUser = await User.findUserById(req.params.id);

			// Validation
			if (!dbUser) {
				errorMessages.push(createError("The id provided dit not match any user.", 404, "USER_NOT_FOUND"));
				throw errorMessages;
			}

			res.status(200).json(dbUser);

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