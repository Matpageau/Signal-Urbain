import { IUserInfos, UserRoleEnum } from "../models/User";
import User from '../models/User';

export const createDefaultUsers = async () => {
  const defaultAdmin: IUserInfos = {
    username: 'admin',
    email: 'admin@example.com',
    password: '12345',
    createdAt: new Date(),
    role: UserRoleEnum.ADMIN
  }
  
  const defaultCityAdmin: IUserInfos = {
    username: 'cityadmin',
    email: 'cityadmin@example.com',
    password: '12345',
    createdAt: new Date(),
    role: UserRoleEnum.CITYADMIN
  } 

  const isAdminExisting = await User.findByUsername(defaultAdmin.username);
  const isManagerExisting = await User.findByUsername(defaultCityAdmin.username);

  if (!isAdminExisting) {
    await User.registerUser(defaultAdmin);
  }

  if (!isManagerExisting) {
    await User.registerUser(defaultCityAdmin);
  }
  if (isAdminExisting && isManagerExisting) {
    console.log(`Admin : ${defaultAdmin.email}`); 
    console.log(`City Admin : ${ defaultCityAdmin.email }`);
  }
};
