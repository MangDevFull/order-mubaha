import { User } from "../models/user.model.js";
import { order } from '../models/order.model.js';
import { Currency } from "../models/currency.model.js";
import roleEnum from "../enums/role.enum.js";
import async from 'async';
const indexPage = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = async.parallel({
        data: (cb) => {
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        }
      })
      const { data, currency } = results
      res.render('admin/index', { data: data, title: "Trang chủ", currency: currency })
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const list_staff_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = await async.parallel({
        data: (cb)=>{
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        list_staff: (cb) => {
            User.find({ role: roleEnum.STAFF }).exec(cb);
        }
      })
      const {data,currency,list_staff} = results
          res.render('admin/account_staff', { data: data, title: "Trang danh sách nhân viên", list_staff: list_staff,currency: currency})
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const list_user_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = await async.parallel({
        data: (cb) =>{
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        list_user: (cb) => {
          User.find({ role: roleEnum.CUSTOMER }).exec(cb);
        }
      })
        const {data,currency,list_user} = results;
          res.render('admin/account_user', { data: data, title: "Trang danh sách người dùng", list_user: list_user,currency: currency})

    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const view_detail_staff = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data: (cb) => {
          User.findById(req.params.id).populate('address').exec(cb)
        }
      })
      const {currency,data} = results;
        res.render('admin/view_detail_staff', { data: data, title: "Trang cá nhân nhân viên",currency: currency})

    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const view_detail_user = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data: (cb) => {
          User.findById(req.params.id).populate('address').exec(cb)
        },
        list_order: (cb) => {
          order
          .find({ user: req.params.id })
          .populate('products')
          .populate('user')
          .populate('address')
          .exec(cb);
        }
      })
      const {data, currency,list_order} = results
        res.render('admin/view_detail_user', { data: data, title: "Trang cá nhân khách hàng", list_order: list_order,currency: currency})
      
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const profile_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data: (cb) => {
          User.findById(req.user._id).populate('address').exec(cb)
        }
      })
      const {data, currency} = results
        res.render('admin/profile', { data: data, title: "Trang cá nhân",currency: currency})
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const view_detail_order_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    const id = req.query.id
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data: (cb) => {
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        infor : (cb) => {
          order
          .findOne({ _id: id })
          .populate('products')
          .populate('user')
          .populate('address')
          .populate('staff')
          .exec(cb)
        }
      })
      const {data, currency,infor} = results
          res.render('admin/view_detail', { data: data, title: "Xem chi tiết order", infor: infor,currency: currency})
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const currency_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.ADMIN) {
    try {
      let results = await async.parallel({
        data: (cb) => {
          User.findById(req.user._id).populate('address').exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        }
      })
      const { data, currency } = results;
      res.render('admin/currency_page', { data: data, currency: currency, title: "Tỷ giá tiền tệ" })
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }

}
export {
  list_staff_page,
  view_detail_staff,
  list_user_page, view_detail_user,
  profile_page,
  indexPage,
  view_detail_order_page,
  currency_page
}