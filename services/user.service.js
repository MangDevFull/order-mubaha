import { User } from '../models/user.model.js';
import { order } from '../models/order.model.js';
import { bank } from '../models/banks.model.js';
import { address } from '../models/address.model.js';
import roleEnum from '../enums/role.enum.js';
import { Notification } from '../models/notification.model.js'
import {Currency} from '../models/currency.model.js';
import async from 'async';
const indexPage = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    try {
      let results = await async.parallel({
        data : (cb)=>{
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        notification_list : (cb) => {
          Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec(cb)
        },
        add: (cb) => {
          User.findById(req.user._id, 'address').populate('address').exec(cb)
        },
        count_message: (cb) => {
          Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
        }
      })
      const {data,notification_list, count_message,add,currency} = results
        res.render('users/create_order', { data: data, title: "Trang tạo đơn hàng", address: add.address, notification_list: notification_list, count_message: count_message,currency:currency })
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập để tiếp tục mua hàng')
    res.redirect('/auth/login')
  }
}
const profile_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    try {
      let results = await async.parallel({
        data: (cb) => {
          User.findById(req.user._id).populate('address').exec(cb)
        },
        notification_list: (cb) => {
          Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec(cb)
        },
        count_message: (cb) => {
          Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
        }
      })
      const {data,notification_list,count_message,currency} = results
      res.render('users/profile', { data: data, title: "Trang cá nhân", notification_list: notification_list, count_message: count_message,currency:currency })
    } catch (error) {
      console.log(error)
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const list_order_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    const status = req.query.status
    try {
      const data = await User.findById(req.user._id, '_id fullname').exec()
      if (data) {
        let list_order;
        if (status == null) {
          list_order = await order
            .find({ user: req.user._id })
            .populate('products')
            .populate('user')
            .sort({ createdAt: -1 })
            .exec();
        } else {
          list_order = await order
            .find({ user: req.user._id, status: status })
            .populate('products')
            .populate('user')
            .sort({ createdAt: -1 })
            .exec();
        }
        if (list_order) {
          try {
            let results = await async.parallel({
              notification_list: (cb) => {
                Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec(cb);
              },
              count_message: (cb) => {
                Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
              },
              count_order_pending: (cb) => {
                order.countDocuments({ status: "pending_quoted" , user: req.user._id }).exec(cb)
              },
              count_order_quoted: (cb) => {
                order.countDocuments({ status: "quoted", user: req.user._id }).exec(cb)
              },
              count_order_shipping: (cb) => {
                order.countDocuments({ status: "shipping", user: req.user._id }).exec(cb)
              },
              currency: (cb) => {
                Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
              }
            })
              const { count_order_pending, 
                count_order_quoted,
                count_order_shipping,
                notification_list, count_message , currency} = results;
              res.render('users/list_order', { data: data, title: "Danh sách đơn hàng", 
              my_order: list_order, status: status, notification_list: notification_list, 
              count_message: count_message, count_order_pending: count_order_pending,
              count_order_quoted :count_order_quoted,count_order_shipping:count_order_shipping, currency:currency
            })
          }
          catch (err) {
            console.log(err);
          }

        }
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const notifications = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    const query = req.query.page || 1
        const options = {
          page: query,
          limit: 10,
          collation: {
            locale: 'vi',
          },
          sort: { createdAt: -1 },
          populate: 'order_id',
        };
    try {
      let results = await async.parallel({
        data : (cb) =>{
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        notification_list: (cb) => {
          Notification.paginate({ user: req.user._id }, options).then(result => {
            cb(null, result);
          })
        },
        count_message: (cb) => {
          Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
        }
      })
      const {data, notification_list, count_message,currency} = results
        res.render('users/notifications', { data: data, title: "Thông báo", notification_list: notification_list, count_message: count_message,currency:currency })
      
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')

  }
}
const view_detail_order_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    const id = req.query.id
    try {
      let results = await async.parallel({
        data: (cb) => {
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        infor: (cb) => {
          order.findOne({ _id: id }).populate('products').populate('user').populate('address').populate('staff').exec(cb)
        },
        notification_list: (cb) => {
          Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec(cb);
        },
        count_message: (cb) => {
          Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
        },
        banks: (cb) => {
          bank.find(cb)
        },
        currency: (cb) => {
          Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
        }
      })
      const { data, infor, notification_list, count_message, banks,currency } = results
      res.render('users/view_detail', { data: data, title: "Xem chi tiết order", infor: infor, notification_list: notification_list, count_message: count_message, banks: banks,currency: currency})
    }
    catch (err) {
      console.log(err);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const detail_address_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    const id = req.params.id;
    try {
      let results = await async.parallel({
        data: (cb) =>{
          User.findById(req.user._id, '_id fullname').exec(cb)
        },
        infor: (cb) => {
          address.findOne({ _id: id }).exec(cb)
        },
        notification_list: (cb) => {
          Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec(cb);
        },
        count_message: (cb) => {
          Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
        }
      })
      const {data,infor, notification_list, count_message,currency} = results
      res.render('users/view_detail_address', { data: data, title: "Xem chi tiết địa chỉ", infor: infor, notification_list: notification_list, count_message: count_message,currency:currency })
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const list_address_page = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    try {
      let results = await async.parallel({
        data: (cb) => {
          User.findById(req.user._id, '_id fullname address').populate('address').exec(cb)
        },
        notification_list: (cb) => {
          Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec(cb)
        },
        count_message: (cb) => {
          Notification.countDocuments({ is_read: false, user: req.user._id }).exec(cb)
        },
        currency: (cb) => {
          Currency.findOne({_id:"61cea0ef7279b1e42c321d95"}).exec(cb)
        }
      })
      const {data, notification_list, count_message,currency} = results
        res.render('users/list_address', { data: data, title: "Trang danh sách địa chỉ", notification_list: notification_list, count_message: count_message,currency: currency})
      
    } catch (error) {
      console.error(error);
    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
const view_detail_notification = async (req, res) => {
  if (req.user && req.user.role == roleEnum.CUSTOMER) {
    const id = req.query.id
    try {
      const data = await User.findById(req.user._id, '_id fullname address').populate('address').exec()
      const deatil_email = await Notification.findOne({ _id: id }).populate("user").populate("order_id")
      if (deatil_email) {
        const notification_list = await Notification.find({ user: req.user._id }).populate('order_id').sort({ createdAt: -1 }).limit(5).exec()
        const count_message = await Notification.countDocuments({ is_read: false, user: req.user._id }).exec()
        res.render('users/view_detail_notification', { data: data, title: "Xem chi tiết thông báo", deatil_email: deatil_email, notification_list: notification_list, count_message: count_message })
      }
    } catch (error) {

    }
  } else {
    req.flash('ha', 'Bạn cần phải đăng nhập')
    res.redirect('/auth/login')
  }
}
export {
  indexPage,
  profile_page,
  list_order_page,
  list_address_page,
  detail_address_page,
  view_detail_order_page,
  notifications,
  view_detail_notification,
}