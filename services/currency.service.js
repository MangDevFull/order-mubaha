import {Currency} from '../models/currency.model.js'
import httpMsgs from "http-msgs";
const update_currency = async (req, res) => {
    const {id,price} = req.body
    console.log(req.body)
    try {
        const update = await Currency.updateOne({_id:id},{price:price})
        if(update){
            return httpMsgs.sendJSON(req,res,{'boolean' : true})
        }else{
            return httpMsgs.sendJSON(req,res,{'boolean' : false})
        }
    } catch (error) {
        console.error(error)
        return httpMsgs.sendJSON(req,res,{'boolean' : false})
    }
}
export{
    update_currency
}