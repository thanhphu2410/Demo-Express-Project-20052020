var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({ 
    id: 'String',
    prods: 'Object'
});
var Item = mongoose.model('Item', itemSchema, 'item');

module.exports = Item;
