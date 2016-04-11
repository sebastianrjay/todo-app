var seeder = require('mongoose-seed');
var UserAccount = require('./models/user-account');
var Todo = require('./models/todo');
var userAccountsCreated = 0;

// Connect to MongoDB via Mongoose
var uriString = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL || 'mongodb://localhost/todo_app';

seeder.connect(uriString, function() {

    // Load Mongoose models
    seeder.loadModels([
        'models/todo.js',
        'models/user-account.js'
    ]);

    // Clear specified collections
    seeder.clearModels(['Todo', 'UserAccount'], function() {

        UserAccount.register(new UserAccount({ username: 'joe@gmail.com' }), 'joeschmo', function(err, userAccount) {
            if (err) {
              console.log('Error when creating seed account joe@gmail.com.');
            } else {
                console.log('Seed user account joe@gmail.com successfully created.');
                userAccountsCreated++;
                if(userAccountsCreated === 2) process.exit();
            }
        });

        UserAccount.register(new UserAccount({ username: 'user@gmail.com' }), 'usemenow', function(err, userAccount) {
            if (err) {
              console.log('Error when creating seed account user@gmail.com.');
            } else {
                console.log('Seed user account user@gmail.com successfully created.');
                userAccountsCreated++;
                if(userAccountsCreated === 2) process.exit();
            }
        });

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(todos);

    });
});

// Data array containing seed data - documents organized by Model
var todos = [
    {
        'model': 'Todo',
        'documents': [
            {
                'username': 'joe@gmail.com',
                'description': 'Finish income taxes',
                'done': false,
                'starred': true
            },
            {
                'username': 'joe@gmail.com',
                'description': 'Buy groceries',
                'done': true,
                'starred': true,
                'completedAt': new Date()
            },
            {
                'username': 'joe@gmail.com',
                'description': 'Refactor todo-app',
                'done': false,
                'starred': false
            },
            {
                'username': 'joe@gmail.com',
                'description': 'Share link to my todos with user@gmail.com',
                'done': false,
                'starred': false
            },
            {
                'username': 'user@gmail.com',
                'description': 'Create a todo',
                'done': true,
                'starred': false
            },
            {
                'username': 'user@gmail.com',
                'description': 'Find car keys',
                'done': false,
                'starred': true
            },
            {
                'username': 'user@gmail.com',
                'description': 'Explore todo-app',
                'done': false,
                'starred': false
            },
            {
                'username': 'user@gmail.com',
                'description': 'Share link to my todos with joe@gmail.com',
                'done': false,
                'starred': false
            }
        ]
    }
];