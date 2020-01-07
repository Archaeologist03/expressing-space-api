import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tvShowSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
  },
  genre: {
    type: String,
  },
});

export default mongoose.model('TvShow', tvShowSchema);
