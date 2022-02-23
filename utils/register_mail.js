import nodeMailer from 'nodemailer'
import mailInfrorEnums from '../enums/mail_infor.enum.js';
export const send_mail_confirm = (email,fullname,host,t)=>{
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
      const mailOptions = { from: mailInfrorEnums.USERNAME, to: email, subject: 'Xác nhận tài khoản gmail', text: 'Xin chào '+ fullname +',\n\n' + 'Vui lòng xác nhận tài khoản của mình bằng đường link: \nhttp:\/\/' + host + '\/register/confirmation?email=' + email + '&&token=' + t + '\n\nCảm ơn!\n' };
      return transporter.sendMail(mailOptions)

}