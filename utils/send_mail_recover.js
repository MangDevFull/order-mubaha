import nodeMailer from 'nodemailer'
import mailInfrorEnums from '../enums/mail_infor.enum.js';
export const sendMailRecover = (to,pass) => {
  const transporter = nodeMailer.createTransport({
    host: mailInfrorEnums.SERVER,
    port: mailInfrorEnums.PORT,
    secure: false, 
    auth: {
      user: mailInfrorEnums.USERNAME,
      pass: mailInfrorEnums.PASSWORD
    }
  })
  const options = {
    from:  mailInfrorEnums.USERNAME, 
    to: to, 
    subject: "Gửi thông tin mật khẩu mới cho khách hàng", 
    html: "Mật khẩu mới của bạn là " +pass 
  }
  return transporter.sendMail(options)
}