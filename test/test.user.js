var should = require("should");
var mongoose = require('mongoose');
var UserAccount = require("../models/user-account.js");
var db;

describe('UserAccount', function() {

    before(function(done) {
        db = mongoose.connect('mongodb://localhost/test');
            done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        var userAccount = new UserAccount({
            username: '12345',
            password: 'testy'
        });

        userAccount.save(function(error) {
            if (error) console.log('error ' + error.message + ' when saving userAccount');
            else console.log('new test userAccount saved successfully');
            done();
        });
    });

    it('find a user by username', function(done) {
        UserAccount.findOne({ username: '12345' }, function(err, userAccount) {
            console.log("   username: ", userAccount.username);
            userAccount.username.should.eql('12345');
            done();
        });
    });

    it('does not allow unencrypted passswords to be read from the database', function(done) {
        UserAccount.findOne({ username: '12345' }, function(err, userAccount) {
            console.log("   password: ", userAccount.password);
            userAccount.password.should.not.eql('testy');
            done();
        });
    });

    afterEach(function(done) {
        UserAccount.remove({}, function() {
            done();
        });
     });
});
