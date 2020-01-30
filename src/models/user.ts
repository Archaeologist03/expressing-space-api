import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_User } from '../interfaces/I_User';

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<I_User & mongoose.Document>('User', userSchema);
