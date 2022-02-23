import { User } from '../models/user.model.js';
import httpMsgs from "http-msgs";
import bcrypt from 'bcryptjs';
const update_pass = async (req,res) =>{
    const {id,pass} = req.body;
    const hashedPassword = bcrypt.hashSync(pass);
    try {
        const update = await User
        .updateOne({_id:id},{password:hashedPassword})
        if(update){
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }
    } catch (error) {
        console.log(error);
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}  
export default update_pass