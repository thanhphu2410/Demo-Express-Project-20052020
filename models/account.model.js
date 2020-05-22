var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({ 
    username: 'string',
    password: 'string',
    name: 'string',
    phone: 'string',
    id: 'string',
    avatar: 'string',
    cartItem: 'string'
});
var Account = mongoose.model('Account', accountSchema, 'account');

module.exports = Account;
