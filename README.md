# About

This is a basic todo app, written by Sebastian Jay in 3 days.

It is built on the MongoDB, ExpressJS, AngularJS, and NodeJS (MEAN) stack.

Additionally, it takes advantage of Mongoose database models, JADE templating, 
error flashes from connect-flash, and user authentication built in 
passport-local and passport-local-mongoose.

# Local Use Instructions

To run the app locally, first install npm, MongoDB and the npm MongoDB driver.
Then, open 2 separate tabs in the terminal. In the first tab, run 'mongod' to 
start the MongoDB driver. In the second tab, run 'npm start' to start the NodeJS 
on port 3000. The app can be accessed via 'localhost:3000' in your web browser.

Run 'make test' to run the Mongoose UserAccount model unit test. So far there 
only two tests. I added one to ensure that unencrypted passwords cannot be read 
from the database; it fails. I'm surprised that Mongoose allows unencrypted 
passwords to be read from the database. 

Heroku deployment and DB seed instructions coming soon...

# Description

Features:

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
their own at the database level.
