const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./../config/key');

const User = mongoose.model('./src/app/models/Users.js');


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
  });
  
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: 'http://localhost:3000/auth/confirmLoginGoogle'
  }, (profile, done) => {

    // Check if google profile exist.
    if (profile.id) {

      User.findOne({username: profile.id})
        .then((existingUser) => {
          if (existingUser) {
            done(null, existingUser);
          } else {
            new User({
              username: profile.id,
              email: profile.emails[0].value,
              hoTen: profile.name.familyName + ' ' + profile.name.givenName
            })
              .save()
              .then(user => done(null, user));
          }
        })
    }
  })
);
