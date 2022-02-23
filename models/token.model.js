import mongoose from 'mongoose';
const { Schema } = mongoose;
const token_schema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
},{
    timestamps: true,
  });
const Token= mongoose.model('token', token_schema , 'token');
export {Token};