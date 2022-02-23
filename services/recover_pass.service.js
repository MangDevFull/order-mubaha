import {User} from '../models/user.model.js';
import roleEnum from '../enums/role.enum.js';
import httpMsgs from "http-msgs";
import bcrypt from 'bcryptjs';
import {sendMailRecover} from '../utils/send_mail_recover.js'
const recover_pass = async (req, res) => {
    const data = req.body;
    try {
        const find_mail = await User.findOne({email: data.data});
        if(find_mail){
            const randomstring = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(randomstring);
            await User.updateOne({email:data.data},{password:hashedPassword});
            sendMailRecover(data.data,randomstring)
            return httpMsgs.sendJSON(req, res, { boolean: true });
        }else{
            return httpMsgs.sendJSON(req, res, { boolean: false });
        }
    } catch (error) {
        console.error(error);
    }
}
export{
    recover_pass
}