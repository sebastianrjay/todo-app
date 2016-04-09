# About

This is a basic todo app, written by Sebastian Jay in 3 days.

It is built on the MongoDB, ExpressJS, AngularJS, and NodeJS (MEAN) stack.

Additionally, it takes advantage of Mongoose database models, JADE templating, 
error flashes from connect-flash, and user authentication built in 
passport-local and passport-local-mongoose.

# Local Use Instructions

To run the app locally:

* First install npm, MongoDB and the npm MongoDB driver if not already installed.
Be sure to add the npm, mongo, and mongod commands to your $PATH.
* Clone this repository in the desired location.
* Run 'npm install'
* Open a new terminal tab or window and run 'mongod' to start the MongoDB driver 
and run the database. Leave this tab alone, and open a new tab in the root 
directory of todo-app. Complete the remaining steps in the new tab.
* Run 'npm run seed' to seed the database. Press CONTROL-C once the console 
shows that two user accounts have been created.
* Run 'npm start' to start the NodeJS server on port 3000. The app can be 
accessed via 'localhost:3000' in your web browser.

Go ahead and log in as a seed user, such as Joe (username: joe@gmail.com, 
password: joeschmo) or User (username: user@gmail.com, password: usemenow).

# Testing

To run the tests:

* First run 'mongod' from within the todo-app file tree, to start the database.
* Open a new terminal window/tab and switch to the todo-app root directory. Run 
'npm test' to run the Mongoose UserAccount model unit test.

So far there only two tests. I added one to ensure that unencrypted passwords 
cannot be read from the database; it fails. I'm surprised that Mongoose allows 
unencrypted passwords to be read from the database, even in the dev environment. 

# Features

* User authentication in passport-local, passport-local-mongoose and mongoose 
features a unique salt for each user document. Password data is automatically 
encrypted.

* Users can browse all of their todos, or exclusively their incomplete, done or
starred todos. All todos are sorted by their completion date when displayed in 
the browser. Incomplete todos show up first, and then complete todos are sorted 
by completion date (descending). 

* Users can edit their todos at the database level simply by clicking on each of 
the properties displayed in the browser. (The description is PATCHed as soon as 
the user hits the RETURN key. The 'done' and 'starred' checkboxes are updated in 
the database with each change.) When a done todo is changed to NOT be done, 
that todo's completion date is reset to null.

* Users can send each other links to view each other's todos. However, they must 
be logged in to view other users' todos, and they cannot edit any todos besides 
their own at the database level. When viewing their own todos, they can click on 
the orange tutu home icon in the upper left corner to return to viewing their 
own todos.
