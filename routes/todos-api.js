var express = require('express');
var Todo = require('../models/todo');
var UserAccount = require('../models/user-account');
var router = express.Router();

function isWriteAuthorized(req) {
	if(!req.user || decodeURIComponent(req.params.username) !== req.user.username) {
		return false;
	} else return true;
}

router.get('/users/:username/todos', function(req, res, next) {
	if(!req.user) return res.redirect('/');
	
	var constraints = { username: decodeURIComponent(req.params.username) };

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

  Todo.find(constraints).sort({ done: 1, completedAt: -1 }).lean().exec(function(err, todos) {
		if(err) {
			var msg = "Could not find todos associated with user " + req.query.username;
			res.send(JSON.stringify({ error: msg }));
		} else {
			res.send(JSON.stringify({ todos: todos }));
		}
	});
});

router.patch('/users/:username/todos/:todo_id', function(req, res, next) {
	if(!isWriteAuthorized(req)) return res.sendStatus(403);

	Todo.findById(decodeURIComponent(req.params.todo_id), function(err, todo) {
		if(err) return next(err);
		
		var done = todo.done, completedAt = todo.completedAt;
		if(done !== JSON.parse(req.query.done)) {
			done = JSON.parse(req.query.done);
			completedAt = (done ? new Date() : null);
		}

		todo.description = req.query.description;
		todo.starred = JSON.parse(req.query.starred);
		todo.done = done;
		todo.completedAt = completedAt;

		todo.save(function (err) {
	    if(err) return next(err);

	    res.json({ todo: todo });
	  });
	});
});

router.post('/users/:username/todos', function(req, res, next) {
	if(!isWriteAuthorized(req)) return res.sendStatus(403);

	UserAccount.findOne({ username: req.user.username }, function(err, user) {
		if(err) return next(err);
			
		var params = {};
		params.description = req.query.description;
		params.username = req.user.username;
		params.starred = JSON.parse(req.query.starred) || false;
		params.done = JSON.parse(req.query.done) || false;
		params.completedAt = (params.done ? new Date() : null);

		Todo.create(params, function(err, todo) {
			if(err) return next(err);

			res.send(JSON.stringify({ todo: todo }));				
		});
	});
});

module.exports = router;
