var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate())); //validate 

passport.serializeUser(User.serializeUser()); // to support sessions
passport.deserializeUser(User.deserializeUser()); // to support sessions