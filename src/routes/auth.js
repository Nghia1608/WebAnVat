const express = require('express');
const router = express.Router();
const AuthController = require('../app/controllers/AuthController')
const SiteController = require('../app/controllers/SiteController')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../.././key.js');

const {
    verifyToken,
  } = require("../app/controllers/Middleware");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

  passport.deserializeUser((id, done) => {
  Users.findById(id)
    .then(user => {
      done(null, user);
    })
});
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: 'http://localhost:3000/auth/confirmLoginGoogle'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        console.log("o day ne");

    }

  )
);

  
//REGISTER
router.get('/register',AuthController.register);
router.post('/registerUser', AuthController.registerUser);

//REFRESH TOKEN
router.post('/refresh', AuthController.requestRefreshToken);
//LOG IN
router.get('/login',AuthController.login);
//LOG IN GOOGLE ACCOUNT
router.get(
  '/login1',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }),AuthController.login1
);
router.get('/confirmLoginGoogle',
        passport.authenticate('google')//lay token google
         ,AuthController.confirmLoginGoogle
        );


router.post('/confirmLogin',AuthController.confirmLogin);
//LOG OUT
router.post('/logout', verifyToken, AuthController.logOut);


module.exports = router;