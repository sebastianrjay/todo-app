var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Todo = require('./todo');
var passportLocalMongoose = require('passport-local-mongoose');

var UserAccount = new Schema({
  username: String,
  password: String,
  todos: [Todo]
},
{ 
	timestamps: true 
});

UserAccount.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserAccount', UserAccount);
