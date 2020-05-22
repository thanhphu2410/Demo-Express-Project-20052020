var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({ 
    id: 'string',
    prods: 'object'
});
var Item = mongoose.model('Item', itemSchema, 'item');

module.exports = Item;
