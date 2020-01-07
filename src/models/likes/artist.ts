import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  art: {
    type: String,
  },
  genre: {
    type: String,
  },
});

export default mongoose.model('Artist', artistSchema);
