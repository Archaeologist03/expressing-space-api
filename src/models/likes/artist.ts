import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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

export default mongoose.model('Artist', artistchema);
