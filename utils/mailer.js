import nodeMailer from 'nodemailer'
import mailInfrorEnums from '../enums/mail_infor.enum.js';
export const sendMail = (to,pass) => {
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
    from: mailInfrorEnums.USERNAME, 
    to: to, 
    subject: "Gửi thông tin mật khẩu nhân viên", 
    html: "Tài khoản đăng nhập của bạn là " +pass 
  }
  return transporter.sendMail(options)
}