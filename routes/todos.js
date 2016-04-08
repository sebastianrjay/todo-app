var express = require('express');
var Todo = require('../models/todo');
var UserAccount = require('../models/user-account');
var router = express.Router();

function isWriteAuthorized(req) {
	if(!req.user || decodeURIComponent(req.params.uid) !== req.user.username) {
		return false;
	} else return true;
}

router.get('/users/:uid/todos', function(req, res, next) {
	var constraints = { username: decodeURIComponent(req.params.uid) };

  switch(req.query.todoType) {
  	case 'done':
  		constraints.done = true;
  		break;
  	case 'incomplete':
  		constraints.done = false;
  		break;
  	case 'starred':
  		constraints.starred = true;
  		break;
  }

  Todo.find(constraints).sort({ completedAt: -1 }).lean().exec(function(err, todos) {
		if(err) {
			var msg = "Could not find todos associated with user " + req.query.username;
			res.send(JSON.stringify({ error: msg }));
		} else {
			res.send(JSON.stringify({ todos: todos }));
		}
	});
});

router.patch('/users/:uid/todos', function(req, res, next) {
	if(!isWriteAuthorized(req)) return res.send("403 - Forbidden");

	Todo.find({ username: req.user.username, description: req.query.description })
		.limit(1).exec(function(err, todo) {
			if(err) {
				return next(err);
			} else {
				var done = todo.done, completedAt = todo.completedAt;
				if(done !== req.query.done) {
					done = req.query.done;
					completedAt = (done ? new Date() : null);
				}

				todo.description = req.query.description;
				todo.starred = req.query.starred;
				todo.done = done;
				todo.completedAt = completedAt;

				todo.save(function (err) {
			    if(err) return next(err);
			    res.send(JSON.stringify({ todo: todo }));
			  });
			}
		});
});

router.post('/users/:uid/todos', function(req, res, next) {
	if(!isWriteAuthorized(req)) return res.send("403 - Forbidden");

	UserAccount.find({ username: req.user.username }).exec(function(err, user) {
		if(err) {
			return next(err);
		} else {
			var params = {};
			params.description = req.query.description;
			params.username = req.user.username;
			params.starred = req.query.starred || false;
			params.done = req.query.done || false;
			params.completedAt = (params.done ? new Date() : null);

			Todo.create(params, function(err, todo) {
				if(err) return next(err);
				res.send(JSON.stringify({ todo: todo }));				
			});
		}
	});
});

module.exports = router;
