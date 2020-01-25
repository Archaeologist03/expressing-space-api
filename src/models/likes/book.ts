import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { I_Book } from '../../interfaces/I_Book';

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
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

export default mongoose.model<I_Book & mongoose.Document>('Book', bookSchema);
