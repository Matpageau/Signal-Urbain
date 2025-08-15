import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { t } from 'i18next';
import UserModel from './UserSchema';

export interface IUserInfos {
  username: string;
  password: string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
  avatar?: string;
}

export enum UserRoleEnum {
  GUESS = 'guess',
  USER = 'user',
  CITYADMIN = 'cityadmin', 
  ADMIN = 'admin'
}

export default class User {
  username: string;
  password: string;
  role: IUserInfos['role'];
  email: string;
  createdAt: Date;
  avatar?: string;

  constructor({ username, email, password, role }: IUserInfos) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.email = email;
    this.createdAt = new Date();
    this.avatar = undefined;
  }

  /**
   * This async function saves the user instance into the database.
   * @returns A promise of the saved user information as object
   */
  async save(): Promise<void> {
    try {
      const userInfo = new UserModel({
        username: this.username,
        password: this.password,
        role: this.role,
        email: this.email,
        createdAt: this.createdAt,
        avatar: this.avatar
      });
      await userInfo.save();
      console.log(`User ${this.username} saved successfully.`);

    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  }

  /**
   * This async function verify if the email or username already exists,
   * then it hashes the password and it then saves the new user into the database.
   * @param data Object containing user information
   * @returns The newly created user information as object
   */
  static async registerUser(data: IUserInfos): Promise<User | string> {
    try {
      // Check if user already exists
      const existingUsername = await mongoose.model('User').findOne({ username: data.username });
      const existingEmail = await mongoose.model('User').findOne({ email: data.email });
      if (existingEmail) {
        return t("classes.user.errors.existing-email");
      } else if (existingUsername) {
        return t("classes.user.errors.existing-username");
      } else if (!data.username || !data.email || !data.password) {
        return t("classes.user.errors.invalid-fields");
      }

      // Create new instance
      const newUser = new User(data);
      // Hash password
      newUser.password = await newUser.hashPassword();
      // Save to DB
      await newUser.save();
      return newUser;
      
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  /**
   * A static async function that logs in a user by verifying their credentials.
   * @param email The username of the user trying to log in.
   * @param password The password of the user trying to log in.
   * @returns A valid JWT token if the credentials are correct, or an error message if they are not.
   */
  static async loginUser(email: string, password: string): Promise<{ token: string, user: IUserInfos } | string > {
    try {
      // Find user by username
      const user = await User.findByEmail(email);
      if (!user) {
        return t("classes.user.errors.invalid-email");
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return t("classes.user.errors.invalid-password");
      }

      // Generate JWT for 15 minutes
      const token = await user.generateToken(false);
      return {
      token,
      user: {
        username: user.username,
        password:  "",
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar,
      }
    };
    } catch (error) {
      console.error("Error logging in user:", error);
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
    try {
      if (!rawPassword || rawPassword.trim() === '') {
        throw new Error(t("classes.user.errors.invalid-password"));
      }
      
      return bcrypt.compare(rawPassword, this.password);
    }
    catch (error) {
      console.error("Error comparing password:", error);
      throw error;
    }
  };

  /**
   * This function generates a JWT token for the user.
   * @param rememberMe A boolean that manage the duration of the token by indicating if the user wants to be remembered (true, 7day) or not (false, 15min).
   * @returns A JWT token as a string
   */
  generateToken(rememberMe: boolean = false): string {
    try {
      const payload = {
        email: this.email,
        username: this.username,
        role: this.role,
        createdAt: this.createdAt,
        avatar: this.avatar
      };
      
      const secret = process.env.PRIV_JWT_CODE || 'dev_secret_key';
      const options = {
        // Ternary condition that set the expiration token based on @param: rememberMe<boolean> checkbox
        expiresIn: rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24
      };

      const token = jwt.sign(payload, secret, options);
      return token;

    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  }

  /**
   * This async function retrieves all users from the database.
   * @returns It returns an array of User instances.
   */
  static async findAll(): Promise<User[]> {
    try {
      const databaseUsers = await mongoose.model('User').find();
      if (!databaseUsers || databaseUsers.length === 0) {
        return [];
      }

      return databaseUsers.map(user => new User({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar
      }));

    } catch (error) {
      console.error("Error finding users:", error);
      throw error;
    }
  }

  /**
   * An async function that search for one user by their username in the database.
   * @param username The username of the user to search for.
   * @returns It returns the user object if found, or null if not found.
   */
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await mongoose.model('User').findOne({ username });
      if (!user) {
        return null;
      }

      return new User({
        username: user.username,
        email: user.email,
        password: "",
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar
      });
      
    } catch (error) {
      console.error(`Error finding user with username: ${username}`);
      console.error(`Error:`, error);
      throw error;
    }
  }

  /**
   * An async function that searches for a user by their ID in the database.
   * @param userId The ID of the user to search for. 
   * @returns It returns the user object if found, or null if not found.
   */
  static async findUserById(userId: string): Promise<User | null> {
    try {
      const user = await mongoose.model('User').findById(userId);
      if (!user) {
        return null;
      }
      return new User({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar
      });

    } catch (error) {
      console.error(`Error finding user with ID: ${userId}`);
      console.error(`Error:`, error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await mongoose.model('User').findOne({ email });
      if (!user) {
        return null;
      }
      return new User({
        username: user.username,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        avatar: user.avatar
      });
    } catch (error) {
      console.error(`Error finding user with email: ${email}`);
      throw error;
    }
  }
  
  /**
   * An async function that deletes a user by their ID from the database.
   * @param userId The ID of the user to delete.
   * @returns A message indicating the result of the deletion operation, or null if the user was not found.
   */
  static async deleteUserById(userId: string): Promise<string | null> {
    try {
      const user = await mongoose.model('User').findByIdAndDelete(userId);
      if (!user) {
        return null;
      }
      return `User with ID ${userId} has been deleted successfully.`;

    } catch (error) {
      console.error(`Error deleting user with ID: ${userId}`);
      console.error(`Error:`, error)
      throw error;
    }
  }
};
