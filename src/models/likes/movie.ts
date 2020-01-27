import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_Movie } from '../../interfaces/I_Movie';

const movieSchema = new Schema({
  title: {
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

export default mongoose.model<I_Movie & mongoose.Document>(
  'Movie',
  movieSchema,
);
