var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/Test1');

var db = mongoose.connection;

//Task Schema
var TaskSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    due_date: {
        type: String,
        default: Date.now
    },
    priority: {
        type: String,
        default: "Low"
    },
    status: {
        type: String,
        default: "Not Started"
    }

}, {collection: 'tasks'});

var Task = module.exports = mongoose.model('Task', TaskSchema);