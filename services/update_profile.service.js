import { User } from '../models/user.model.js';
import httpMsgs from "http-msgs";
const update_profile = async (req,res) =>{
    const {id, fullname,phone,date,gender } = req.body
    try {
        const update = await User
        .updateOne({_id:id},{fullname:fullname, phone:phone, date_of_birth:date,gender:gender})
        if(update){
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }
    } catch (error) {
        console.log(error);
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}  
export{
    update_profile
}