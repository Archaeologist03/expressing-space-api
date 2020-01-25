import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_Song } from '../../interfaces/I_Song';

const songSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

export default mongoose.model<I_Song & mongoose.Document>('Song', songSchema);
