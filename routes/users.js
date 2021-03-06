// ----- Express
const express = require('express');
const router = express.Router();
// ----- Mongoose
const mongoose = require('mongoose');
// ----- Bcryptjs
const bcrypt = require('bcryptjs');
// ----- Passport
const passport = require('passport');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form Post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/ideas',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req, res, next);
});

// Register form POST
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'Passwords do not match'
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: 'Password must be at least 4 characters'
    });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({
        email: req.body.email
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email is already registered');
          res.redirect('/users/login');
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Successfully Registerd');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logged Out');
  res.redirect('/users/login');
})

module.exports = router;