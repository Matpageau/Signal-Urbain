import { Request, Response, NextFunction } from 'express';
import { IUserInfos, UserRoleEnum } from '../models/User';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import createError from '../utils/Error';
import { create } from 'domain';

const userController = {

	async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const newUserData: IUserInfos = req.body;
			newUserData.role = UserRoleEnum.USER;

			const newUser = await User.registerUser(newUserData);
			res.status(201).json(newUser);

		} catch (error) {
			next(error);
		}
	},


	async login(req: Request, res: Response, next: NextFunction) {    
    const { email, password } = req.body;
		const errorMessages = [];

		if (!email || !password) {
			errorMessages.push(createError("You must provide a valid email and password", 401, "INPUT_INVALID"))
    }

    try {
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
			
			const user = User.findById(decodedToken._id);
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
			const users = await User.findAll();
			if (!users || users.length === 0) {
				return res.status(404).json({
					ApiMessage: req.t('controllers.user.errors.no-user-found')
				});
			}

			res.status(200).json({
				ApiMessage: req.t('controllers.user.get-users-success'),
				return: users
			});
		} catch (error) {
			next(error);
		}
	},

	
	async getUserById(req: Request, res: Response, next: NextFunction) {
		try {

			const user = await User.findUserById(req.params.id);
			if (!user) {
				return res.status(404).json({
					ApiMessage: req.t('controllers.user.errors.invalid-id')
				});
			}

			res.status(200).json({
					ApiMessage: req.t('controllers.user.get-user-success'),
					return: user
				});

		} catch (error) {
			next(error);
		}
	},

	// TODO Implement that only admin can delete users
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.id;
			const deletedUser = await User.deleteUserById(userId);
			if (!deletedUser) {
				return res.status(404).json({
					ApiMessage: req.t('controllers.user.errors.invalid-id')
				});
			}
			res.status(200).json({
				ApiMessage: req.t('controllers.user.delete-success'),
				return: deletedUser
			});
		} catch (error) {
			next(error);
		}
	}
}

export default userController;