import express from 'express';
import roleEnum from '../enums/role.enum.js';
import initPassportLocal from "../services/auth.service.js";
import { recover_pass } from "../services/recover_pass.service.js";

const router = express.Router()

/* Auth Logic */
const passport = initPassportLocal

/* GET users listing. */
router.get('/login', function (req, res, next) {
  // if (req.user) {
  //   if (!req.user.isVerified) {
  //     res.redirect('/register/confirm_email?email=' + req.user.email);
  //   }
  //   if (req.user && req.user.role === roleEnum.CUSTOMER) {
  //     res.redirect('/user/create')
  //   }
  //   if (req.user && req.user.role === roleEnum.ADMIN) {
  //     res.redirect('/admin/')
  //   }
  //   if (req.user && req.user.role === roleEnum.STAFF) {
  //     res.redirect('/staff/')
  //   }
  // } else {
    let message = req.flash();
    console.log(message)
    res.render('login', {
      message: message,
    });
  
});
router.get('/recoverpw', (req, res) => {
  res.render('recover_pass', { title: "Lấy lại mật khẩu" })
})

router.post('/recover_pass', recover_pass)

router.post('/login/password', (req, res, next) => {
  passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/auth/login');
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        } else {
          if (user.isVerified) {
            if (user.role == roleEnum.CUSTOMER) {
              return res.redirect('/user/create');
            } else if (user.role == roleEnum.STAFF) {
              return res.redirect('/staff/');
            } else {
              return res.redirect('/admin/');
            }
          } else {
            res.redirect('/register/confirm_email?email=' + user.email);
          }
        }

      });

    })(req, res, next);
});

// router.use( (req, res) =>{
//   res.locals.error = req.flash('error');
//   res.locals.success = req.flash('success');
// })

// router.post('/login/password', passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/auth/login',
//   failureMessage: true
// }));

// login facebook
router.get('/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['email', 'public_profile'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/user/create',
    failureRedirect: '/auth/login'
  }), (req, res) => {
    req.session.start();
    res.redirect('/');
  });

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/auth/login');
});
router.get('/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    successRedirect: '/user/create',
    failureRedirect: '/auth/login',
    failureMessage: true
  }));

router.get('/google/callback/',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    successRedirect: '/user/create',
  }), (req, res) => {
    console.log('success')
    req.session.start();
    res.redirect('/')
  })

export default router;