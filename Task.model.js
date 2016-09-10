var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    title: String,
    description: String,
    due: String,
    priority: String,
    status: String
});

module.exports = mongoose.model('Task', TaskSchema);