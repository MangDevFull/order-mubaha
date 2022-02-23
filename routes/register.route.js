import express from 'express';
import {check_email_empty,register,
    verification,
    resend} from '../services/register.service.js'
const router = express.Router();

router.use((req, res, next) => {
    res.locals.layout = './register/layout'
    next();
})

router.get('/',(req, res) => {
    res.render('register/index',{title: 'Đăng ký'});
})
router.get('/verification',(req, res) => {
    const email = req.query.email
    const fullname = req.query.fullname
    const data = {email: email, fullname: fullname}
    res.render('register/verification',{title: 'Xác thực email',message:"Chúng tôi đã gửi đường link xác thực đến email của bạn ,Vui lòng kiểm tra hòm thư: "+email,send:"false",data:data});
})
router.post('/submit',register)
router.get('/confirmation',verification)
router.post('/check_email',check_email_empty)
router.get('/resend_mail',resend)
router.get("/confirm_email",function(req,res) {
    const message = req.query.email
    res.render("register/login_verifi",{message:message})
})
export default router
