var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Sign Up'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

                    // upload.none() tells multer to use only text fields,
                    // but allows the enctype to be multipart/form-data as
                    // opposed to  application/x-www-form-urlencoded
router.post('/signup', upload.none(), function(req, res, next) {
  // req.body.x == the name attribute of the form data not the id
  var name = req.body.registerName;
  var email = req.body.registerEmail;
  var username = req.body.registerUsername;
  var password = req.body.registerPassword;
  var password2 = req.body.registerPassword2;

  // Form Validator
  req.checkBody('registerName', 'Name field is required').notEmpty();
  req.checkBody('registerEmail', 'Email field is required').notEmpty();
  req.checkBody('registerEmail', 'Email is not valid').isEmail();
  req.checkBody('registerUsername', 'Username field is required').notEmpty();
  req.checkBody('registerPassword', 'Password field is required').notEmpty();
  req.checkBody('registerPassword2', 'Passwords do not match').equals(req.body.registerPassword);

  //Check Errors
  var errors = req.validationErrors();
  if (errors) {
    res.render('signup', {
      errors: errors
    });
  } else {
      var newUser = new User({
          name: name,
          email: email,
          username: username,
          password: password
      });

      User.findOne({username: newUser.username}, function(err, user){
          if (err) throw err;
          if (!user){
              User.findOne({email: newUser.email}, function(err, email){
                  if (err) throw err;
                  if (!email){


                      // Executes if email and username does not exist yet
                      User.createUser(newUser, function (err, user) {
                          if (err) throw err;
                          console.log(user);
                      });
                      req.flash('success', 'You are now registered and can login');

                      res.location('/login');
                      res.redirect('/login');

                  } else { // Email account already exists
                      req.flash('error', 'An acccount is already using this email address');
                      res.location('/signup');
                      res.redirect('/signup');
                  }
              });
          } else { // Username already exists
              req.flash('error', 'Username already exists');
              res.location('/signup');
              res.redirect('/signup');
          }
      });

  }
});

router.post('/login',
    passport.authenticate('local',{failureRedirect:'/login', failureFlash: 'Invalid username or password'}),
    function(req, res) {
        res.redirect('/users/overview');
    });

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, done){
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message:'Invalid Password'});
            }
        });
    });
}));

module.exports = router;
