import express from 'express';
import {list_order,my_list_order,view_detail_order_page,profile_page,view_detail_order,view_detail_user} from '../services/staff.service.js'
import {update_order_quoting,quote_order} from '../services/quote.service.js'
import accept_order from'../services/accept_order.service.js'
import update_delivery_status_order from '../services/update_satus_order.js'
import check_quoted from '../services/check.service.js'
import {update_profile} from '../services/update_profile.service.js'
import{handle_cancle_order,handle_sucess_order,handle_update_price_order,
    handle_update_checkout_order} from '../services/handle_staff_quoted.service.js'
    import check_pass from '../services/check_pass.service.js'
    import update_pass from '../services/update_pass.service.js'
import {update_deposit,update_ref,update_unpaid_and_paid} from '../services/handle_checkout.service.js'
import {update_add} from '../services/add_address.service.js'
const router = express.Router();

router.use(function (req, res, next) {
    res.locals.layout = './staff/layout';
    next();
});
router.get('/', list_order)
router.route('/profile').get(profile_page)
router.get("/my_order",my_list_order)
router.get("/view_detail_order",view_detail_order_page)
router.post('/update_ship',update_delivery_status_order)
router.post('/update_quote',update_order_quoting)
router.post("/check_order",check_quoted)
router.post('/updatat_profile',update_profile)
router.get('/baogia_id=:id',view_detail_order)
router.post('/baogia',quote_order)
//handle staff quoted order
router.post("/handle_cancel",handle_cancle_order)
router.post('/accept',accept_order)
router.post('/handle_success',handle_sucess_order)
router.post('/handle_update_price',handle_update_price_order)
router.post('/update_checkout',handle_update_checkout_order)
router.post('/checkpasss',check_pass)
router.post('/update_passe',update_pass)
router.post("/update_add",update_add)
router.get("/view_detail_user",view_detail_user)

//handle checkout
router.post('/update_checkout_dep',update_deposit)
router.post('/update_checkout_ref',update_ref)
router.post('/update_checkout_unpaid_paid',update_unpaid_and_paid)
export default router;