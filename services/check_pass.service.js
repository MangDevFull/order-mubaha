import {User} from '../models/user.model.js';
import httpMsgs from "http-msgs";
import bcrypt from 'bcryptjs';
const check_pass = async (req, res, next) => {
    const pass = req.body.data
    const loggedIn = bcrypt.compareSync(pass, req.user.password);
    if(loggedIn){
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
    }else{
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
export default check_pass