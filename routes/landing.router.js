import {Router} from 'express'
const router = Router()
router.use(function (req, res, next) {
    res.locals.layout = './landing/layout';
    next();
});


router.get('/', function (req, res, next) {
    res.render('landing/index', {title: 'Trang chủ'})
})
router.get('/terms_of_service', (req, res) => {
    res.render('landing/terms_service', {title: 'Điều khoản dịch vụ'})
})
router.get('/privacy_policy', (req, res) => {
    res.render('landing/privacy_policy', {title: 'Chính sách bảo mật'})
})
router.get('/about', function (req, res, next){
    res.render('landing/intro', {title: 'Giới thiệu'})
})
router.get('/service', function (req, res, next){
    res.render('landing/service', {title: 'Dịch vụ'})
})
router.get('/guide', function (req, res, next){
    res.render('landing/guide', {title: 'Hướng dẫn đặt hàng'})
})
router.get('/guide_pay', function (req, res, next){
    res.render('landing/guide_pay', {title: 'Hướng dẫn thanh toán'})
})
router.get('/support', function (req, res, next){
    res.render('landing/support', {title: 'Hỗ trợ'})
})
router.get('/price_list', function (req, res, next){
    res.render('landing/price_list', {title: 'Bảng giá'})
})


export default router