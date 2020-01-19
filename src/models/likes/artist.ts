import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_Artist } from '../../interfaces/IArtist';

const artistchema = new Schema({
  name: {
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

export default mongoose.model<I_Artist & mongoose.Document>(
  'Artist',
  artistchema,
);
