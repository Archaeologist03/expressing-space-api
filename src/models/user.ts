import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  likes: {
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    tvShows: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TvShow',
      },
    ],
    songs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    artists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
      },
    ],
  },
});

export default mongoose.model('User', userSchema);
