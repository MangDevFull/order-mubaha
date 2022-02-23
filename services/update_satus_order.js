import {order} from '../models/order.model.js'
import httpMsgs from "http-msgs";
import {sendMailStatus} from '../utils/send_mail_status.js'
import {Notification} from '../models/notification.model.js'
const update_delivery_status_order = async (req, res) => {
    const data = req.body
    console.log(data)
    const accept_status = {time : data.date_time,status : data.status}
     const _order = await order
    .updateOne({nanoId:data.id},{$push: {shipping_status : accept_status }})
    .exec();
    try {
        _order
        await new Notification({order_id:data.orderID,user:data.userID,content:data.status}).save()
        sendMailStatus(data.emailCus,data.id,data.status,data.nameCus)
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
export default update_delivery_status_order
