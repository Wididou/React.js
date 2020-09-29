var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var FacebookTokenStrategy = require('passport-facebook-token');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');
const { NotExtended } = require('http-errors');

exports.local = passport.use(new LocalStrategy(User.authenticate())); //validate 

passport.serializeUser(User.serializeUser()); // to support sessions
passport.deserializeUser(User.deserializeUser()); // to support sessions

exports.getToken = function(user) { //create token & send it back
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};

var opts = {}; //options for jwt based strategy
//extracted from incoming request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//token is in authorization-header
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => { //second param is verify function, done is callback provided by pasport
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));
exports.verifyUser = passport.authenticate('jwt', {session: false}); //uses token in header
// and verifies incoming user if its successfull it allows u to proceed
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) next();
    else {
        var err = new Error();
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'You are not authorized to perform this operation!'});
        return next(err);
    }
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));
