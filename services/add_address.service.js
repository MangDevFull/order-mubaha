import mongoose from 'mongoose';
import {User} from '../models/user.model.js';
import httpMsgs from 'http-msgs';
import { address } from '../models/address.model.js';
const create_add = async (req, res, next) => {
    const {user,city,district,ward,add,fullname,phone} = req.body;
    try {
        const create = new address({
            user : user,
            fullname,
            phone,
            city: city,
            district: district,
            ward: ward,
            add: add,
        })
        const save_add = await create.save();
        if(save_add){
            await User.findByIdAndUpdate(user,{$push: { address: create._id }})
            const add = await User.findById(user,'address').populate('address').exec()
            if(add){
                return httpMsgs.sendJSON(req,res,{'boolean' : true,'add':add})
            }
        }
    } catch (error) {
        console.error(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
const update_add = async (req, res) => {
    const {id,city,district,ward,add,fullname,phone} = req.body;
    const update_add = address
    .updateOne({_id:id},{city:city,district:district,ward:ward,fullname:fullname,phone:phone,add:add})
    .exec();
    try {
      if(update_add) {
        return httpMsgs.sendJSON(req,res,{'boolean' : true})
      }else {
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
      }
    } catch (error) {
        console.log(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
const delete_add = async (req, res) => {
    const delete_add = address.findByIdAndRemove(req.body.data).exec()
    try {
      if(delete_add) {
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
    create_add,
    update_add,
    delete_add
}