require("dotenv").config();
const router = require('express').Router();
const db = require('../data/dbConfig');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
  
  done(null, user);
});

passport.deserializeUser(function(id, done) {

    done(null, id);

});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://lnkshrt.app/auth/success/"
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile)
  }
  
));

router.get('/', passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => {
	console.log("Logging in via Google");
});

router.get('/user', (req, res) => {
  const returnedUser = {id: req.user.id, name: req.user.displayName, email: req.user.emails[0].value};
  res.status(200).json(returnedUser)
})

router.get('/success', passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => {
  
  res.redirect('https://client.lnkshrt.app/dashboard')
});


router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/")
})

module.exports = router