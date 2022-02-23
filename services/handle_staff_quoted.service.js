import { order } from '../models/order.model.js';
import httpMsgs from "http-msgs";
import enumsOrder from '../enums/orderStatus.enum.js';
import {sendMailStatus} from '../utils/send_mail_status.js'
import notificationEnums from '../enums/mail_notification.enum.js'
import {Notification} from '../models/notification.model.js'
const handle_cancle_order = async (req, res) => {
    const data = req.body
    console.log(data)
    const update_cancle = order
    .updateOne({nanoId:data.id},{status: enumsOrder.CANCEL,reson_cancle : data.reason,cancle_date: Date.now()})
    .exec();
    try {
      if(update_cancle) {
        await new Notification({order_id:data.orderID,user:data.userID,content:notificationEnums.CANCEL+" vì lý do " +data.reason}).save()
        sendMailStatus(data.emailCus,data.id,notificationEnums.CANCEL+" vì lý do " +data.reason,data.nameCus)
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
      }else {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
  }
  const handle_sucess_order = async (req, res) => {
    const data = req.body
    const update_success = order
    .updateOne({nanoId:data.id},{status: enumsOrder.SUCCESS,success_date: Date.now()})
    .exec();
    try {
      if(update_success) {
        await new Notification({order_id:data.orderID,user:data.userID,content:notificationEnums.SUCCESS}).save()
        sendMailStatus(data.emailCus,data.id,notificationEnums.SUCCESS,data.nameCus)
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
      }else {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
  }
  const handle_update_checkout_order = async (req, res) => {
    const data = req.body
    console.log(data)
    const update_checkout = order
    .updateOne({nanoId:data.id},{status_checkout:data.checkout})
    .exec();
    try {
      if(update_checkout) {
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
      }else {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
  }
  const handle_update_price_order = async (req, res) => {
    const {id,price_delivery_china,price_delivery_china_to_vn,delivery_vn,total_price,total} = req.body
    const{orderID,userID,nameCus,emailCus} = req.body
      const quote_order = order
     .updateOne({nanoId:id},
      {
        status : enumsOrder.QUOTED,
        quoted_update_date: Date.now(),
      price_delivery_china :price_delivery_china,
      price_delivery_china_to_vn : price_delivery_china_to_vn,
      delivery_vn : delivery_vn,
      total_price : total_price,
      total : total,
      })
     .exec();
     try {
       if(quote_order) {
        await new Notification({order_id:orderID,user:userID,content:notificationEnums.UPDATE_QUOTED}).save()
        sendMailStatus(emailCus,id,notificationEnums.UPDATE_QUOTED,nameCus)
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
    handle_cancle_order,
    handle_sucess_order,
    handle_update_price_order,
    handle_update_checkout_order
}