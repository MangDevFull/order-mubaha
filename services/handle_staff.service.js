import { User } from '../models/user.model.js'
import httpMsgs from "http-msgs";
import { address } from '../models/address.model.js';
import roleEnum from '../enums/role.enum.js';
import {sendMail} from '../utils/mailer.js'
import bcrypt from 'bcryptjs';
const create_staff = async (req, res) => {
    const { fullname, email,phone,add,ward,city,district,date,gender, } = req.body
    const randomstring = Math.random().toString(36).slice(-8);
    try {
    const check_mail = await User.findOne({ email: email})
    if(check_mail){
        return  httpMsgs.sendJSON(req,res,{'boolean' : "exist"})
    }else{
        const hashedPassword = bcrypt.hashSync(randomstring);
        const user = new User({
            fullname: fullname,
            phone : phone,
            email: email,
            password: hashedPassword,
            role : roleEnum.STAFF,
            date_of_birth :date,
            gender: gender,
        })
        const save_staff = await user.save();
        if(save_staff){
            const create_address = new address({
                user : user._id,
                fullname,
                phone,
                city: city,
                district: district,
                ward: ward,
                add: add,
            })
            await create_address.save()
            await User.findByIdAndUpdate(user._id,{$push: { address: create_address._id }})
            sendMail(email,randomstring)
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }
    }
    } catch (error) {
        console.error(error);
        return  httpMsgs.sendJSON(req,res,{'boolean' : false})
    }

}
const delete_staff = async (req, res, next) => {
    const delete_staff = User.findByIdAndRemove(req.body.data).exec()
    try {
      if(delete_staff) {
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
      }else {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
export { 
    create_staff,
    delete_staff}