import passport from "passport";
import passportLocal from "passport-local";
import {User} from "../models/user.model.js";
import passportFacebook from 'passport-facebook';
import  * as passportGoogle  from "passport-google-oauth"
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
dotenv.config();
let LocalStrategy = passportLocal.Strategy;
let FacebookStrategy = passportFacebook.Strategy;
let GoogleStrategy = passportGoogle.OAuth2Strategy
passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async (req, email, password, done)=> {
    try {
        let user = await User.findOne({email:email});
        if (!user) {
            req.flash('error', 'Email đăng nhập không tồn tại')
            return done(null, false);
        }
        if (user.isBlock){
            req.flash('error', 'Tài khoản của bạn đã bị khóa')
            return done(null, false);
        }
        
        const loggedIn = bcrypt.compareSync(password, user.password);
        if (!loggedIn) {
            req.flash('error', 'Mật khẩu đăng nhập sai' )
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        console.log(error);
        return done(null, false);
    }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const options=  {
    clientID: process.env.FBAPP_CLIENT_ID,
    clientSecret:process.env.FBAPP_CLIENT_SECRET,
    callbackURL: process.env.HOST+"/auth/facebook/callback"
}
// make our facebook strategy
passport.use(new FacebookStrategy(options,
    // facebook will send back the token and profile
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
            try{
                const userModel = await User.findOne({
                    'email': profile.id+'@facebook.com',
                })

                if(!userModel){
                    let user = new User({
                        email: profile.id+'@facebook.com',
                        facebook_id : profile.id,
                        fullname: profile.displayName,
                        isVerified : true
                    })
                    user.save((err)=>{
                        if (err) console.log(err)
                        return done(err, user)
                    })
                }
                
                else {
                    return done(null,userModel)
                }
            } catch (error) {
                console.log(error);
                return done(null, false);
            }
          });
    }
));

//google auth
const CLIENT_ID = process.env.GG_CLIENT_ID
const CLIENT_SECRET = process.env.GG_CLIENT_SECRET
//findOrCreate logic
const AuthLogin = async function(accessToken, refreshToken, profile, done) {
    try{
        console.log(profile)
        const userModel = await User.findOne({
            'email': profile._json.email,
        })
        if(!userModel){
            let user = new User({
                email: profile._json.email,
                google_id: profile.id,
                fullname: profile.displayName,
                isVerified : true

            })
            user.save((err)=>{
                if (err) console.log(err)
                return done(err, user)
            })
        }
        else {
            return done(null,userModel)
        }
    } catch (error) {
        console.log(error);
        return done(null, false);
    }
}

passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: process.env.HOST+"/auth/google/callback",
}, AuthLogin));


export default passport;