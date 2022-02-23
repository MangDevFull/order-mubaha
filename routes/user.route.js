import {Router} from 'express'
import {indexPage,profile_page,list_order_page,view_detail_order_page, detail_address_page,list_address_page, notifications, view_detail_notification} from '../services/user.service.js'
import {create_order,cancel_order} from '../services/order.service.js'
import {create_add,update_add,delete_add} from '../services/add_address.service.js'
import {update_profile} from '../services/update_profile.service.js'
import check_pass from '../services/check_pass.service.js'
import update_pass from '../services/update_pass.service.js'
import {update_read} from '../services/notification.service.js'
import {crawl} from '../services/crawl.service.js'
const router = Router()

router.use(function (req, res, next) {
    res.locals.layout = './users/layout';
    next();
});

router.get('/notifications', notifications)
router.route('/view_detail_notification').get(view_detail_notification)
router.post('/update_read',update_read);
router.route('/create').get( indexPage)
router.route('/profile').get(profile_page)
router.route('/list_order').get(list_order_page);
router.get("/view_detail",view_detail_order_page)
router.post('/order_create',create_order)
router.post('/add_address',create_add)
router.post("/update_local",)
router.route("/profile").get(profile_page)
router.route("/address").get(list_address_page)
router.post('/updatat_profile',update_profile)
router.route('/view_detail_address_id=:id').get(detail_address_page);
router.post("/update_add",update_add)
router.post("/delete_add",delete_add)
router.post('/action_cancle',cancel_order)
router.post('/checkpasss',check_pass)
router.post('/update_passe',update_pass)


router.post('/crawl',crawl)

export default router;