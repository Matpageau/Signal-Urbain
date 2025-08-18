import mongoose from "mongoose";
import { IUserInfos, UserRoleEnum } from "../models/User";
import User from '../models/User';

export const createDefaultUsers = async () => {
  const defaultAdmin: IUserInfos = {
    _id: new mongoose.Types.ObjectId("777000000000000000000011").toString(),
    username: 'admin',
    email: 'admin@example.com',
    password: '12345',
    createdAt: new Date(),
    role: UserRoleEnum.ADMIN
  }
  
  const defaultCityAdmin: IUserInfos = {
    _id: new mongoose.Types.ObjectId("777000000000000000000012").toString(),
    username: 'cityadmin',
    email: 'cityadmin@example.com',
    password: '12345',
    createdAt: new Date(),
    role: UserRoleEnum.CITYADMIN
  } 

  const defaultUser: IUserInfos = {
    _id: new mongoose.Types.ObjectId("777000000000000000000013").toString(),
    username: "user",
    email: "user@example.com",
    password: "12345",
    createdAt: new Date(),
    role: UserRoleEnum.USER
  }

  const isAdminExisting = await User.findByUsername(defaultAdmin.username);
  const isManagerExisting = await User.findByUsername(defaultCityAdmin.username);
  const isUserExisting = await User.findByUsername(defaultUser.username);

  if (!isAdminExisting) {
    await User.registerUser(defaultAdmin);
  }
  if (!isManagerExisting) {
    await User.registerUser(defaultCityAdmin);
  }
  if (!isUserExisting) {
    await User.registerUser(defaultUser);
  }

  if (isAdminExisting && isManagerExisting && isUserExisting) {
    console.log(`Admin : ${defaultAdmin.email}`); 
    console.log(`City Admin : ${defaultCityAdmin.email}`);
    console.log(`User: ${defaultUser.email}`);
  }
};
