import mongoose, { Schema } from 'mongoose';
import { iUserValues } from './User';

const userSchema = new Schema<iUserValues>({
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

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
