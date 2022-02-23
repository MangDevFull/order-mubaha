import mongoose from 'mongoose';
const { Schema } = mongoose;
const address_schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    fullname :{
        type : String
    },
    phone: {
        type : String
    },
    city: {
        type : String,
    },
    district: {
        type: String,
    },
    ward: {
        type: String,
    },
    add : { type: String}
},{
    timestamps: true,
  });
const address= mongoose.model('address', address_schema , 'address');
export {address};