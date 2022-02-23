import { User } from '../models/user.model.js';
import { order } from '../models/order.model.js';
import roleEnum from '../enums/role.enum.js';
import enumsOrder from '../enums/orderStatus.enum.js';
import {Currency} from '../models/currency.model.js';
import async from 'async';
const list_order = async (req, res) => {
  if (req.user && req.user.role == roleEnum.STAFF) {
    try {
      let results = await async.parallel({
        data : (cb) => {
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        list_order: (cb) => {
          order.find({ status: enumsOrder.PENDING_QUOTED, check: 0 }).populate('products').populate('user').populate('address').sort({"created_at": 1}).exec(cb);
        },
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        }
      })
      const {data,list_order,currency} = results
          res.render('staff/index', { data: data, title: "Trang danh sách đơn hàng", list_order: list_order,currency: currency})
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập' )
    res.redirect('/auth/login')
  }
}
const my_list_order = async (req, res) => {
  if (req.user && req.user.role == roleEnum.STAFF) {
    const status = req.query.status
    try {
      console.log(req.user)
      const data = await User.findById(req.user._id, '_id fullname').exec()
      if (data) {
        let my_list_order;
        if(status==null) {
          my_list_order = await order
          .find({ staff: req.user._id})
          .populate('products')
          .populate('user')
          .sort({ createdAt: -1 })
          .exec();
        }else if(status==enumsOrder.PENDING_QUOTED) {
          my_list_order = await order
          .find({ staff: req.user._id})
          .populate('products')
          .populate('user')
          .sort({ createdAt: 1 })
          .exec();
        }else{
          my_list_order = await order
          .find({ staff: req.user._id,status:status })
          .populate('products')
          .populate('user')
          .sort({ createdAt: -1 })
          .exec();
        }
        if (my_list_order) {
          const currency = await Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec()
          //res.send(my_list_order)
          res.render('staff/my_list', { data: data, title: "Danh sách đơn hàng", my_list_order: my_list_order ,status:status,currency:currency})
        }
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập' )
    res.redirect('/auth/login')
  }
}
const view_detail_order_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.STAFF) {
    const id = req.query.id
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data: (cb) => {
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        infor: (cb) => {
          order
          .findOne({ _id: id })
          .populate('products')
          .populate('user')
          .populate('address')
          .populate('staff')
          .exec(cb)
        }
      })
      const {data,infor,currency} = results
          res.render('staff/view_detail', { data: data, title: "Xem chi tiết order", infor: infor,currency: currency})

    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập' )
    res.redirect('/auth/login')
  }
}
const view_detail_order = async (req, res) => {
  if (req.user && req.user.role == "staff") {
    const id = req.params.id;
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data : (cb) => {
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        infor: (cb) => {
          order
          .findOne({ _id: id })
          .populate('products')
          .populate('user')
          .exec(cb)
        }
        
      })
      const {data,currency,infor} = results
          res.render('staff/baogia', { data: data, title: "Xem chi tiết order", infor: infor,currency: currency})
        
    } catch (error) {
      console.error(error);
    }
  } else {
    res.redirect('/auth/login')
  }
}
const profile_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.STAFF) {
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data : (cb) => {
          User.findById(req.user._id).populate('address').exec(cb)
        }
      })
      const {data,currency} = results
        res.render('staff/profile', {data : data ,title: "Trang cá nhân",currency: currency} )
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập' )
      res.redirect('/auth/login')
  }
}
const view_detail_user = async (req, res) => {
  if (req.user && req.user.role == roleEnum.STAFF) {
    const id = req.query.id
    try {
      let results = await async.parallel({
        currency: (cb) => {
          Currency.findOne({ _id: "61cea0ef7279b1e42c321d95" }).exec(cb)
        },
        data : (cb) => {
          User.findById(id).populate('address').exec(cb)
        }
      })
      const {data,currency} = results
        res.render('staff/view_detail_user', {data : data ,title: "Xem người dùng",currency: currency} )
  
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập' )
      res.redirect('/auth/login')
  }
}
export {
  list_order,
  view_detail_order_page,
  my_list_order,
  profile_page,
  view_detail_order,
  view_detail_user
}