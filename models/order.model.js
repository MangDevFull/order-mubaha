import mongoose from 'mongoose';
import enumsOrder from '../enums/orderStatus.enum.js'
const { Schema } = mongoose;
import {customAlphabet} from 'nanoid'
const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const order_schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    products: [{ type: Schema.Types.ObjectId, ref: 'products'}],
    staff: {type: Schema.Types.ObjectId, ref: 'users'},
    note : {
        type : String,
    },
    address: {type: Schema.Types.ObjectId, ref: 'address'},
    cancle_date: {
        type: Date,
    },
    success_date: {
        type: Date,
    },
    status: {
        type: String,
        enum: enumsOrder,
    },
    reson_cancle :{
        type: String,
    },
    nanoId: {
        type: String,
        required: true,
        default: () => nanoid()
      },
    check : {type: Number},
    quoted_add_date : {type: Date},
    quoted_update_date : {type: Date},
    staff_note : {type: String},
    price_delivery_china :{type :Number},
    price_delivery_china_to_vn : {type: Number},
    delivery_vn : {type: Number},
    total_price : {type: Number},
    total : {type: Number},
    deposited : {type:Number},
    refunds : {type:Number},
    accept_date : {type:Date},
    shipping_status : [
        {
            time: {type:Date},
            status : {type:String}
        }
    ],
    price_check : {type: Number},
    price_remain : {type: Number},
    status_checkout: {
        type: String,
        default : "unpaid"
    }
},{
    timestamps: true,
  });
const order= mongoose.model('order', order_schema , 'orders');
export {order};