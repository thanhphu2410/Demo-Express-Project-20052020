var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({ 
    name: 'string',
    phone: 'string',
    address: 'string',
    grade: 'string'
});
var User = mongoose.model('User', userSchema, 'users');

module.exports = User;
