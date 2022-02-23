import {User} from '../models/user.model.js'
import httpMsgs from "http-msgs";
import {send_mail_block,send_mail_unblock} from '../utils/send_mail_block_user.js';
export const block_user = async (req, res) => {
    const {id,email,fullname} = req.body;
    try {
        const block = await User.updateOne({_id:id},{isBlock : true})
        if(block){
            send_mail_block(email,fullname)
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
        console.error(error);
    }
}
export const unblock_user = async (req, res) => {
    const {id,email,fullname} = req.body;
    try {
        const block = await User.updateOne({_id:id},{isBlock : false})
        if(block){
            send_mail_unblock(email,fullname)
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
        console.error(error);
    }
}