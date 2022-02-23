import httpMsgs from "http-msgs";
import roleEnum from '../enums/role.enum.js';
import {Notification} from '../models/notification.model.js'

const update_read = async (req, res) => {
  const data = req.body
    if (req.user && req.user.role == roleEnum.CUSTOMER) {
      try {
        const notification_update = await Notification.updateOne({_id : data.data},{is_read:true})
        if(notification_update) {
          return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }
      } catch (error) {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } else {
        req.flash('ha', 'Bạn cần phải đăng nhập' )
        res.redirect('/auth/login')
  
    }
}
  export{
    update_read
  }