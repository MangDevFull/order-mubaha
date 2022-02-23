import {order} from '../models/order.model.js'
import httpMsgs from "http-msgs";
import enumsOrder from '../enums/orderStatus.enum.js'
import {sendMailStatus} from '../utils/send_mail_status.js'
import notificationEnums from '../enums/mail_notification.enum.js'
import {Notification} from '../models/notification.model.js'
const accept_order = async (req, res) => {
    const data = req.body
    const accept_status = {time : Date.now(),status : enumsOrder.PENDING_SHIP}
     const _order = await order
    .updateOne({nanoId:data.id},{status: enumsOrder.SHIPPING,
    accept_date : Date.now(),
    $push: {shipping_status : accept_status }})
    .exec();
    try {
        _order
        await new Notification({order_id:data.orderID,user:data.userID,content:notificationEnums.ACCEPT}).save()
              sendMailStatus(data.emailCus,data.id,notificationEnums.ACCEPT,data.nameCus)
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
export default accept_order