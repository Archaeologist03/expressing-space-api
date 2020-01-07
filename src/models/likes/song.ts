import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const songSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
});

export default mongoose.model('Song', songSchema);
