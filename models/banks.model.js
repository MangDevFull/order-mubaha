import mongoose from 'mongoose';

const { Schema } = mongoose;

const bank_schema = new Schema({
    stk : {
        type : String,
    },
    bank: {
        type: String,
    },
    name: { 
        type: String
    },
    image: {
        type: String,
    }
},{
    timestamps: true,
  });
const bank = mongoose.model('banks', bank_schema , 'bankings');
export {bank};