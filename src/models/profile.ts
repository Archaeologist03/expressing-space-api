import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_Profile } from '../interfaces/I_Profile';

const profileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  nickname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  personalInfo: [
    {
      age: {
        type: Number,
      },
    },
    {
      gender: {
        type: String,
      },
    },
    {
      location: {
        type: String,
      },
    },
    {
      languages: {
        type: String,
      },
    },
  ],
});

export default mongoose.model('Profile', profileSchema);
