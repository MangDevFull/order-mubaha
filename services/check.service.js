import { order } from '../models/order.model.js';
import httpMsgs from "http-msgs";
const check_quoted = async (req, res, next) => {
        const id = req.body.data
        const infor = await order.findOne({_id :id,check : 0}).exec()
        if(infor){
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else if(infor===null){
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
}
export default check_quoted