import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_TvShow } from '../../interfaces/I_TvShow';

const tvShowSchema = new Schema({
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

export default mongoose.model<I_TvShow & mongoose.Document>(
  'TvShow',
  tvShowSchema,
);
