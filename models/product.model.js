import mongoose from 'mongoose';

const { Schema } = mongoose;

const product_schema = new Schema({
    order_id : { type: Schema.Types.ObjectId, ref: 'orders' },
    note : {
        type : String,
    },
    number: {
        type: Number,
    },
    link: { 
        type: String
    },
    name: {
        type: String,
    },
    price_china: {
        type: Number,
    },
    price_vn: {
        type: Number,
    },
    address: {type: Schema.Types.ObjectId, ref: 'address'},
    status: {
        type: String,
    },
},{
    timestamps: true,
  });
const product = mongoose.model('products', product_schema , 'products');
export {product};