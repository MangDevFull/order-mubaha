import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const { Schema } = mongoose;

const notification_schema = new Schema({
    content : {
        type : String,
    },
    order_id: {type : Schema.Types.ObjectId, ref: 'order'},
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    is_read: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
  });
  notification_schema.plugin(mongoosePaginate);
const Notification = mongoose.model('notifications', notification_schema , 'notifications');
export {Notification};