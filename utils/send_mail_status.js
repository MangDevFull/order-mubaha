import nodeMailer from 'nodemailer'
import mailInfrorEnums from '../enums/mail_infor.enum.js';
export const sendMailStatus = (to,id,status,infor,reasonCancel) => {
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
    subject: "Gửi thông báo về đơn hàng", 
    html:
     `
     <h2>Xin chào: ${infor}</h2>
     <p>Mubaha thông báo: Đơn hàng ${id} ${status}</p>
     <p>Để biết thêm chi tiết xin vui lòng đăng nhập <a href="https://www.ordermubaha.com/" >https://www.ordermubaha.com/</a></p>
    <p>Trân trọng</p>
    <p>Đội ngũ Mubaha</p>

    `
  }
  return transporter.sendMail(options)
}