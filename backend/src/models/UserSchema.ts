import mongoose, { Schema } from 'mongoose';
import { IUserInfos } from './User';

const userSchema = new Schema<IUserInfos>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true
  },
  avatar: {
    type: String,
    required: false
  }
});

const UserModel = mongoose.model<IUserInfos>('User', userSchema);
export default UserModel;
