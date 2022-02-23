import { User } from "../models/user.model.js";
import roleEnum from '../enums/role.enum.js';
import httpMsgs from "http-msgs";
import bcrypt from 'bcryptjs';
import { Token } from '../models/token.model.js';
import crypto from 'crypto'
import { send_mail_confirm } from "../utils/register_mail.js"
const check_email_empty = (req, res) => {
  const email = req.body.data;
  console.log(email);
  User.findOne({ email: email }, (err, user) => {
    // user is a single document which may be null for no results
    if (err) {
      console.error(err);
      return;
    }
    if (user) {
      httpMsgs.sendJSON(req, res, { boolean: true });
    } else {
      httpMsgs.sendJSON(req, res, { boolean: false });
    }
  });
};
const register = async (req, res) => {
  const { fullname, email, password, phone } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    fullname: fullname,
    phone: phone,
    email: email,
    password: hashedPassword,
    role: roleEnum.CUSTOMER,
  });
  try {
    user.save()
    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    const save_token = await token.save();
    if (save_token) {
      send_mail_confirm(email, fullname, req.headers.host, save_token.token)
      return httpMsgs.sendJSON(req, res, { boolean: true });
    } else {
      return httpMsgs.sendJSON(req, res, { boolean: false });
    }

  } catch (error) {
    console.log(error);
    return httpMsgs.sendJSON(req, res, { boolean: false });
  }

}
const verification = async (req, res) => {
  Token.findOne({ token: req.query.token }, function (err, token) {
    // token is not found into database i.e. token may have expired 
    if (!token) {
      return res.render('register/verification', { title: 'Xác thực email', message: "Liên kết xác minh của bạn có thể đã hết hạn. Vui lòng nhấp vào gửi lại để xác minh Email của bạn.", send: "false" });
    }
    // if token is found then check valid user 
    else {
      User.findOne({ _id: token._userId, email: req.query.email }, function (err, user) {
        // not valid user
        if (!user) {
          return res.render('register/verification', { title: 'Xác thực email', message: "Chúng tôi không thể tìm thấy người dùng để xác minh này. Vui lòng đăng ký!", send: "register" });
        }
        // user is already verified
        else if (user.isVerified) {
          return res.render('register/verification', { title: 'Xác thực email', message: "Tài khoản của bạn đã xác thực , vui lòng đăng nhập", send: "login" });
        }
        else {
          user.isVerified = true;
          user.save(function (err) {
            // error occur
            if (err) {
              return res.status(500).send({ msg: err.message });
            }
            // account successfully verified
            else {
              return res.render('register/confirm_success', { title: 'Xác thực thành công' })
            }
          });
        }
      });
    }

  });
}
const resend = async function (req, res) {
  const data = {email:req.query.email,fullname: req.query.fullname}
  const user = await User.findOne({ email: req.query.email })
  console.log(user.isVerified+"Aaaaaaaaa")
    // user is not found into database
    if (!user) {
      return res.render('register/verification', { title: 'Xác thực email', message: "Chúng tôi không thể tìm thấy người dùng để xác minh này. Vui lòng đăng ký!", send: "register" });
    }
    // user has been already verified
    else if (user.isVerified) {
      return res.render('register/verification', { title: 'Xác thực email', message: "Tài khoản của bạn đã xác thực , vui lòng đăng nhập", send: "login" });
    }
    // send verification link
    else {
      // generate token and save
      const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
      const save_token = await token.save();
      if (save_token) {
        send_mail_confirm(req.query.email, user.fullname, req.headers.host, save_token.token)
        res.render('register/verification',{title: 'Xác thực email',message:"Chúng tôi đã gửi đường link xác thực đến email của bạn ,Vui lòng kiểm tra hòm thư "+req.query.email,send:"false",data:data});
      } else {
        res.render('register/verification',{title: 'Xác thực email',message:"Chúng tôi đã gửi đường link xác thực đến email của bạn ,Vui lòng kiểm tra nó",send:"false",data:data});
      }
    }
}
export {
  check_email_empty,
  register,
  verification,
  resend
};
