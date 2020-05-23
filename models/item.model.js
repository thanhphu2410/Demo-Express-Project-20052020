var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({ 
    id: 'String',
    prodId: 'String',
    prodName: 'String',
    prodPrice: 'String',
    prodDescription: 'String',
    prodImage: 'String',
});
var Item = mongoose.model('Item', itemSchema, 'item');

module.exports = Item;
