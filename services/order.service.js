import {order} from '../models/order.model.js'
import {product} from '../models/product.model.js'
import httpMsgs from "http-msgs";
import enumsOrder from '../enums/orderStatus.enum.js'
import {sendMailStatus} from '../utils/send_mail_status.js'
import roleEnum from '../enums/role.enum.js';
import notificationEnums from '../enums/mail_notification.enum.js'
import {Notification} from '../models/notification.model.js'
import enumsCrawl from '../enums/crawl.enum.js'
const create_order = async (req, res,next) =>{
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    let {products,address,note,user} = req.body;
    products = JSON.parse(products);
    console.log(products);
    const or = new order({
      address: address,
      note : note,
      user : user,
      status : enumsOrder.PENDING_QUOTED,
      check : 0
    })
    try {
       const order_save = await or.save();
        if(order_save){
          for(let i = 0; i < products.length; i++){
              const product_sc = new product({
                address: address,
                note : products[i].note,
                number : products[i].number,
                link : products[i].link,
                name : products[i].name,
                price_china : products[i].price_china,
                price_vn : products[i].price_vn,
                status : enumsOrder.PENDING_QUOTED,
                order_id : or._id 
              })
              product_sc.save()
              await order.findByIdAndUpdate(or._id ,{$push: { products: product_sc._id}})
              
          }
          await new Notification({order_id:or._id,user:req.user._id,content:notificationEnums.CREATE}).save()
              sendMailStatus(req.user.email,or.nanoId,notificationEnums.CREATE,req.user.fullname)
          return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
          return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
      return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập' )
    res.redirect('/auth/login')

}
  }

  const cancel_order = async (req, res) => {
    const data = req.body
    console.log(data)
    const update_cancle = order
    .updateOne({nanoId:data.id},{status:enumsOrder.CANCEL,reson_cancle : data.reson,cancle_date: Date.now()})
    .exec();
    try {
      if(update_cancle) {
        await new Notification({order_id:data.orderID,user:req.user._id,content:notificationEnums.CANCEL+" vì lý do " +data.reson}).save()
        sendMailStatus(req.user.email,data.id,notificationEnums.CANCEL+" vì lý do " +data.reson,req.user.fullname)
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
  create_order,
  cancel_order,
}