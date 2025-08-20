import mongoose, { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createError from '../utils/Error';
import UserModel from './UserSchema';

export enum UserRoleEnum {
  USER = 'user',
  CITYADMIN = 'cityadmin', 
  ADMIN = 'admin'
}

export interface iUserValues {
  _id: string | Types.ObjectId | null;
  username: string;
  password: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
  avatar?: string;
  upvoted_report_ids: string[];
}

export default class User {
  _id: string | Types.ObjectId | null;
  username: string;
  password: string;
  role: iUserValues['role'];
  email: string;
  createdAt: Date;
  avatar?: string;
  upvoted_report_ids: string[];

  constructor({ _id, username, email, password, role }: iUserValues) {
    this._id = _id || null;
    this.username = username;
    this.password = password;
    this.role = role;
    this.email = email;
    this.createdAt = new Date();
    this.avatar = undefined;
    this.upvoted_report_ids= [];
  }

  /**
   * This async function saves the user instance into the database.
   * @returns A promise of the saved user information as object
   */
  async saveUser(): Promise<void> {
    try {
      const userValues = new UserModel({
        _id: this._id,
        username: this.username,
        password: this.password,
        role: this.role,
        email: this.email,
        createdAt: this.createdAt,
        avatar: this.avatar
      });
      await userValues.save();
      console.log(`User ${this.username} was saved successfully.`);
      
    } catch (error) {
      throw error;
    }
  }

  /**
   * This async function verify if the email or username already exists,
   * then it hashes the password and it then saves the new user into the database.
   * @param data Object containing user information
   * @returns The newly created user information as object
   */
  static async registerUser(data: iUserValues) {
    try {
      
    // Check if user already exists
    const existingUsername = await UserModel.findOne({ username: data.username });
    const existingEmail = await UserModel.findOne({ email: data.email });
    const errorMessages : any [] = [];
    
    // Validation
    if (existingEmail) {
      errorMessages.push(createError("Email you are have entered is already in use.", 401, "EMAIL_ALREADY_EXIST"))
    }
    if (existingUsername) {
      errorMessages.push(createError("Username you are have entered is already in use.", 401, "USERNAME_ALREADY_EXIST"))
    }
    if (!data.username || !data.email || !data.password) {
      errorMessages.push(createError("You must provide username, email and password.", 401, "INPUT_INVALID"))
    }
    if (errorMessages.length > 0) {
      throw errorMessages;
    }

    // Create new instance
    const newUser = new User(data);
    // Hash password
    newUser.password = await newUser.hashPassword();
    // Saving to DB
    await newUser.saveUser();
    return newUser;
      
    } catch (error) {
      throw [createError("An error happened during user creation.", 401, "CREATE_USER_ERROR")];
    }
  }

  /**
   * A static async function that logs in a user by verifying their credentials.
   * @param email The username of the user trying to log in.
   * @param password The password of the user trying to log in.
   * @returns A valid JWT token if the credentials are correct, or an error message if they are not.
   */
  static async loginUser(email: string, password: string): Promise<{ token: string | null, user: iUserValues } > {
    try {
      // TODO Add the username login feature
      const errorMessages: any[] = [];
      const user = await User.findByEmail(email);
      if (!user) {
        errorMessages.push(createError("The email provided is not found.", 404, "EMAIL_NOT_FOUND"));
        throw errorMessages;
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        errorMessages.push(createError("The password provided is invalid.", 404, "PASSWORD_INVALID"));        
        throw errorMessages;
      }
      
      // Generate JWT for 1 day
      const token = user.generateToken(false);
      
      return {
        token,
        user: {
          _id: user._id,
          username: user.username,
          password:  "",
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          avatar: user.avatar,
          upvoted_report_ids: user.upvoted_report_ids
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * This async function use bcrypt module to hash the raw password.
   * @returns A promise of an hashed password ready to save into the database.
   */
  async hashPassword(): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);  
    return await bcrypt.hash(this.password, salt);
  };

  /**
   * @param rawPassword 
   * This async function use bcrypt module to compare the raw password with the encrypted password.
   * It returns true if they match, false otherwise.
   * @returns A boolean
   */
  async comparePassword(rawPassword: string): Promise<boolean> {
  
    const errorMessages = [];

    if (!rawPassword || rawPassword.trim() === '') {
      errorMessages.push(createError("The password provided is invalid.", 401, "PASSWORD_INVALID" ))
      throw errorMessages;
    }
    
    return bcrypt.compare(rawPassword, this.password);
  };

  /**
   * This function uses jwt.sign functions and generates a JWT token for the user.
   * @param rememberMe A boolean that manage the duration of the token by indicating if the user wants to be remembered (true, 7day) or not (false, 15min).
   * @returns A JWT token as a string
   */
  generateToken(rememberMe: boolean = false): string {
    try {
      const userPayload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
        createdAt: this.createdAt,
        avatar: this.avatar
      };
      
      const secret = process.env.PRIV_JWT_CODE;
      const options = {
        // Ternary condition that set the expiration token based on @param: rememberMe<boolean> checkbox
        expiresIn: rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24
      };

      const token = jwt.sign(userPayload, secret!, options);
      return token;

    } catch (error) {
      throw createError("There was an error during token generation", 500, "GEN_TOKEN_ERROR" )
    }
  }

  /**
   * This async function retrieves all users from the database.
   * @returns It returns an array of User instances.
   */
  static async findAll(): Promise<User[]> {

    const dbUsers = await UserModel.find();
    if (!dbUsers || dbUsers.length === 0) {
      return [];
    }

    return dbUsers.map((user: any) => new User({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      avatar: user.avatar,
      upvoted_report_ids: user.upvoted_report_ids
    }));
  }

  /**
   * An async function that searches for a user by their ID in the database.
   * @param userId The ID of the user to search for. 
   * @returns It returns the user object if found, or null if not found.
   */
  static async findUserById(userId: string): Promise<User | null> {

    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }

    return new User({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      avatar: user.avatar,
      upvoted_report_ids: user.upvoted_report_ids
    });
  }

  /**
   * An async function that searches for a user by their email in the database.
   * @param email The email of the user to search for.
   * @returns It returns the user object if found, or null if not found.
   */
  static async findByEmail(email: string): Promise<User | null> {
    
    const errorMessages = [];
    const user = await mongoose.model('User').findOne({ email });
    
    if (!user) {
      errorMessages.push(createError("The id provided dit not match any user", 404, "USER_NOT_FOUND"))
      throw errorMessages;
    }
    
    return new User({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      avatar: user.avatar,
      upvoted_report_ids: user.upvoted_report_ids
    });
  }
  
  /**
   * An async function that deletes a user by their ID from the database.
   * @param userId The ID of the user to delete.
   * @returns A message indicating the result of the deletion operation, or null if the user was not found.
   */
  static async deleteUserById(userId: string): Promise<boolean> {
    
    const errorMessages = [];
    const user = await UserModel.findByIdAndDelete(userId);
    
    if (!user) {
      errorMessages.push(createError("The id provided dit not match any user", 404, "USER_NOT_FOUND"))
      throw errorMessages;
    }
  
    return true;
  }
};
