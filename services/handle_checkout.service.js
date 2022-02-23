import {order} from '../models/order.model.js'
import httpMsgs from "http-msgs";
import {sendMailStatus} from '../utils/send_mail_status.js'
import notificationEnums from '../enums/mail_notification.enum.js'
import {Notification} from '../models/notification.model.js'
function formatNumber(nStr, decSeperate, groupSeperate) {
    nStr += '';
   var x = nStr.split(decSeperate);
   var x1 = x[0];
   var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + groupSeperate + '$2');
    }
    return x1 + x2;
}
const update_deposit = async (req, res) => {
    let {id,price,status,orderID,emailCus,nameCus,userID} = req.body;
     const NEWprice = formatNumber(price, '.', ',')
     console.log(req.body);
    try {
        const update_dep = await order.updateOne({nanoId:id},{deposited:price,status_checkout:status})
        if(update_dep){
            await new Notification({order_id:orderID,user:userID,content:notificationEnums.DEPOSITE+NEWprice+" VND"}).save()
        sendMailStatus(emailCus,id,notificationEnums.DEPOSITE+NEWprice+" VND",nameCus)
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
const update_unpaid_and_paid = async (req, res) => {
    let {id,status,orderID,emailCus,nameCus,userID} = req.body;
    try {
        const update_dep = await order.updateOne({nanoId:id},{status_checkout:status})
        if(update_dep){
            if(status=="unpaid"){
                await new Notification({order_id:orderID,user:userID,content:notificationEnums.UNPAID}).save()
                sendMailStatus(emailCus,id,notificationEnums.UNPAID,nameCus)
            }else{
                await new Notification({order_id:orderID,user:userID,content:notificationEnums.PAID}).save()
                sendMailStatus(emailCus,id,notificationEnums.PAID,nameCus)
            }
         
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
const update_ref = async (req, res) => {
    let {id,price,status,orderID,emailCus,nameCus,userID} = req.body;
    const NEWprice = formatNumber(price, '.', ',')
    try {
        const update_ref = await order.updateOne({nanoId:id},{refunds:price,status_checkout:status})
        if(update_ref){
            await new Notification({order_id:orderID,user:userID,content:notificationEnums.REFUNDS+NEWprice+" VND"}).save()
                sendMailStatus(emailCus,id,notificationEnums.REFUNDS+NEWprice+" VND",nameCus)
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
export{
    update_deposit,
    update_ref,
    update_unpaid_and_paid
}