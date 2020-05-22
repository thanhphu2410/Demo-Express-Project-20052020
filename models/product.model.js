var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({ 
    name: 'string',
    price: 'string',
    description: 'string',
    image: 'string'
});
var Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
