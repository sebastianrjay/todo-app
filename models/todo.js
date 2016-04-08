var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Todo = new Schema({
	username: { type: String, required: true },
	description: String,
	done: Boolean,
	starred: Boolean,
	completedAt: { type: Date, default: null }
},
{ 
	timestamps: true 
});

module.exports = mongoose.model('Todo', Todo);
