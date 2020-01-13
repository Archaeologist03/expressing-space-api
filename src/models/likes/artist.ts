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
  note: {
    type: String,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

export default mongoose.model('Artist', artistSchema);
