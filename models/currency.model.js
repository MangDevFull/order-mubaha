import mongoose from 'mongoose';

const { Schema} = mongoose;

const currency_shcema = new Schema({
    price: {type: Number},
},{timestamps: true});
const Currency = mongoose.model('currencys',currency_shcema,'currencys');
export {Currency}