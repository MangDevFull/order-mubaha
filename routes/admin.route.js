import express from 'express';
import {list_staff_page,view_detail_staff,list_user_page,view_detail_user,indexPage,view_detail_order_page,
    profile_page, currency_page} from '../services/admin.service.js';
import {create_staff,delete_staff} from "../services/handle_staff.service.js"
import {update_profile} from '../services/update_profile.service.js'
import check_pass from '../services/check_pass.service.js'
import update_pass from '../services/update_pass.service.js'
import {update_add} from '../services/add_address.service.js'
import {block_user,unblock_user} from '../services/block_user.service.js'
import {update_currency} from '../services/currency.service.js'
const router = express.Router();

router.use((req, res, next) => {
    res.locals.layout = './admin/layout'
    next();
})
router.route('/').get(indexPage)
router.route("/account_staff").get(list_staff_page)
router.route("/account_user").get(list_user_page)
router.route("/view_detal_staff_id=:id").get(view_detail_staff,list_user_page)
router.route("/view_detail_user_id=:id").get(view_detail_user)
router.post("/create_staff",create_staff)
router.post("/delete_staff",delete_staff)
router.route('/profile').get(profile_page)
router.post('/updatat_profile',update_profile)
router.get("/view_detail",view_detail_order_page)
router.post("/checkpasss",check_pass)
router.post("/update_passe",update_pass)
router.post("/update_add",update_add)
router.post("/block_user",block_user)
router.post("/unblock_user",unblock_user)
//router.get('/account_user', show_account_user);
router.get('/currency_page',currency_page)
router.post('/update_currency',update_currency)


export default router