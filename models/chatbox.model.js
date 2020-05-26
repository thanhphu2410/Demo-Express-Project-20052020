var mongoose = require('mongoose');

var chatboxSchema = new mongoose.Schema({ 
    id_1: 'String',
    id_2: 'String',
    date: 'Array',
    SorR: 'String',
    chats: 'Array'
});
var Chatbox = mongoose.model('Chatbox', chatboxSchema, 'chatbox');

module.exports = Chatbox;