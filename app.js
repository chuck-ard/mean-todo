var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Task = require('./Task.model');
var port = 8080;
var db = 'mongodb://localhost/example';

mongoose.connect(db);

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', function(req, res){
    console.log('Fetching tasks');
    Task.find({})
        .exec(function(err, tasks){
            if ( err )
            {
                console.log(err);
            } else {
                res.json(tasks);
            }

        });
});

app.get('/tasks', function(req, res){
    console.log('Fetching tasks');
    Task.find({})
        .exec(function(err, tasks){
            if ( err )
            {
                console.log(err);
            } else {
                res.json(tasks);
            }

        });
});

app.get('/tasks/:id', function(req, res){
    console.log('Fetching one book');
    Task.findOne({
        _id:req.params.id
    })
        .exec(function(err, task){
            if ( err ) {
                console.log(err);
            } else {
                res.json(task);
            }
        });
});

app.post('/task', function(req, res){
   var newTask = new Task();

    newTask.title = req.body.title;
    newTask.description = req.body.description;
    newTask.due = req.body.due;
    newTask.priority = req.body.priority;
    newTask.status = req.body.status;

    newTask.save(function(err, task){
        if ( err ) {
            res.send('Error saving task');
        } else {
            console.log(task);
            Task.find({})
                .exec(function(err, tasks){
                    if ( err )
                    {
                        console.log(err);
                    } else {
                        res.json(tasks);
                    }

                });
        }
    });
});

app.post('/task2', function(req, res) {
    Task.create(req.body, function(err, task){
        if ( err ) {
            res.send('Error saving task');
        } else {
            console.log(task);
            res.send(task);
        }
    });
});

app.put('/task/:id', function(req, res) {
    Task.findOneAndUpdate({
        _id: req.params.id
    }, {$set: {title: req.body.title}},
        {upsert: true},
        function(err, newTask){
        if ( err ) {
            console.log(err);
            res.send('Error saving task');
        } else {
            console.log(newTask);
            res.send(newTask);
        }
    });
});

app.delete('/task/:id', function(req, res) {
   Task.findOneAndRemove({
       _id:req.params.id
   }, function(err, task) {
       if (err ) {
           res.send('Error deleting task');
       } else {
           console.log(task);
           Task.find({})
               .exec(function(err, tasks){
                   if ( err ) {
                       res.send('Error fetching tasks');
                   } else {
                       res.json(tasks);
                   }
               });
       }
   });
});

app.listen(port, function() {
    console.log('Server is running...');
});