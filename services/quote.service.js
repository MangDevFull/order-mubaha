import {order} from '../models/order.model.js'
import httpMsgs from "http-msgs";
import {sendMailStatus} from '../utils/send_mail_status.js'
import notificationEnums from '../enums/mail_notification.enum.js'
import {Notification} from '../models/notification.model.js'
const update_order_quoting = async (req, res)=>{
     const {id,staff} = req.body;
     const quote_order = order
    .updateOne({_id:id},{check:1,staff : staff})
    .exec();
    try {
      if(quote_order) {
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
      }else {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
const quote_order = async (req, res)=>{
  const {orderID,id,price_delivery_china,price_delivery_china_to_vn,delivery_vn,total_price,total,note,emailCus,nameCus,userID} = req.body
  console.log(emailCus)
  const quote_order = order
 .updateOne({nanoId:id},
  {quoted_add_date:Date.now(),
  price_delivery_china :price_delivery_china,
  price_delivery_china_to_vn : price_delivery_china_to_vn,
  delivery_vn : delivery_vn,
  total_price : total_price,
  total : total,
  staff_note : note,
  status :"quoted"
  })
 .exec();
 try {
   if(quote_order) {
    await new Notification({order_id:orderID,user:userID,content:notificationEnums.QUOTED}).save()
    sendMailStatus(emailCus,id,notificationEnums.QUOTED,nameCus)
     return httpMsgs.sendJSON(req,res,{'boolean' : true})
   }else {
     return httpMsgs.sendJSON(req,res,{'boolean' : false})
   }
 } catch (error) {
     console.log(error)
     return httpMsgs.sendJSON(req,res,{'boolean' : false})
 }
}
export{
    update_order_quoting,
    quote_order
}