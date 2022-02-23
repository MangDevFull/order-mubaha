import nodeMailer from 'nodemailer'
import mailInfrorEnums from '../enums/mail_infor.enum.js';
export const send_mail_block = (email,fullname)=>{
    var transporter = nodeMailer.createTransport(
        {
          host: mailInfrorEnums.SERVER,
          port: mailInfrorEnums.PORT,
          secure: false, 
          auth: {
            user: mailInfrorEnums.USERNAME,
            pass: mailInfrorEnums.PASSWORD
          }
        }
      );
      const mailOptions = { 
        from: mailInfrorEnums.USERNAME, 
        to: email, 
        subject: 'Thông báo khóa tài khoản người dùng', 
        html : 
        `
        <h2>Xin chào ${fullname}</h2>
        <p>Thông báo tài khoản của bạn đã bị khóa vì vi phạm chính sách của chúng tôi</p>
        <p>Nếu bạn có thắc mắc gì hãy liên hệ với chúng tôi <a href="https://www.ordermubaha.com/support">https://www.ordermubaha.com/support</a></p>
        <br>
        <p>Đội ngữ mubaha thân gửi</p>
        `
        }
      return transporter.sendMail(mailOptions)

}
export const send_mail_unblock = (email,fullname)=>{
    var transporter = nodeMailer.createTransport(
        {
          host: mailInfrorEnums.SERVER,
          port: mailInfrorEnums.PORT,
          secure: false, 
          auth: {
            user: mailInfrorEnums.USERNAME,
            pass: mailInfrorEnums.PASSWORD
          }
        }
      );
      const mailOptions = { 
        from: mailInfrorEnums.USERNAME, 
        to: email, 
        subject: 'Thông báo khóa tài khoản người dùng đã được mở khóa', 
        html : 
        `
        <h2>Xin chào ${fullname}</h2>
        <p>Thông báo tài khoản của bạn đã được mở khóa. Bây giờ bạn có thể quay lại để đặt hàng : <a href="https://www.ordermubaha.com/auth/login">https://www.ordermubaha.com/auth/login</a></p>
        <br>
        <p>Đội ngữ mubaha thân gửi</p>
        `
        }
      return transporter.sendMail(mailOptions)

}