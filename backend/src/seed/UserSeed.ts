import mongoose from "mongoose";
import User, { iUserValues, UserRoleEnum } from "../models/User";

export const createDefaultUsers = async () => {
  const defaultAdmin: iUserValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000011").toString(),
    username: 'admin',
    email: 'admin@example.com',
    password: '12345',
    createdAt: new Date(),
    role: UserRoleEnum.ADMIN,
    upvoted_report_ids: []
  }
  
  const defaultCityAdmin: iUserValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000012").toString(),
    username: 'cityadmin',
    email: 'cityadmin@example.com',
    password: '12345',
    createdAt: new Date(),
    role: UserRoleEnum.CITYADMIN,
    upvoted_report_ids: []
  } 

  const defaultUser: iUserValues = {
    _id: new mongoose.Types.ObjectId("777000000000000000000013").toString(),
    username: "user",
    email: "user@example.com",
    password: "12345",
    createdAt: new Date(),
    role: UserRoleEnum.USER,
    upvoted_report_ids: []
  }

  const isAdminExisting = await User.findByEmail(defaultAdmin.email);
  const isManagerExisting = await User.findByEmail(defaultCityAdmin.email);
  const isUserExisting = await User.findByEmail(defaultUser.email);

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
    console.log(``);
    console.log(`User: ${defaultUser.email}`);
    console.log(`Admin : ${defaultAdmin.email}`); 
    console.log(`City Admin : ${defaultCityAdmin.email}`);
    console.log(``);
  }
};
