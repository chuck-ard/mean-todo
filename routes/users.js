var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/userModel');
var Task = require('../models/taskModel');

/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.send('respond with a resource');
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

router.get('/overview', ensureAuthenticated, function(req, res, next) {
  res.render('overview', {title: "Overview"});
});

router.get('/overview/tasks', ensureAuthenticated, function(req, res) {
    Task.find({username: req.user.username})
        .exec(function(err, tasks){
            if ( err )
            {
                console.log(err);
            } else {
                res.json(tasks);
            }
        });
});

router.post('/task', ensureAuthenticated, function(req, res) {
  var newTask = new Task();

  newTask.username = req.user.username;
  console.log(req.user.username);
  newTask.title = req.body.title;
  newTask.description = req.body.description;
  newTask.due_date = req.body.due;
  newTask.priority = req.body.priority;
  newTask.status = req.body.status;

  newTask.save(function(err, task) {
    if ( err ) {
      res.send('Error saving task');
    } else {
      console.log(task);
      Task.find({username: req.user.username})
          .exec(function(err, tasks) {
            if ( err ) {
              console.log(err);
            } else {
              res.json(tasks);
            }
          });
    }
  });
});

router.delete('/task/:id', ensureAuthenticated, function(req, res) {
  Task.findOneAndRemove({
    _id:req.params.id
  }, function(err, task) {
    if ( err ) {
      res.send('Error deleting task');
    } else {
      console.log(task);
      Task.find({username: req.user.username})
          .exec(function(err, tasks) {
            if ( err ) {
              res.send('Error Fetching tasks');
            } else {
              res.json(tasks);
            }
          });
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/login');
});
module.exports = router;
