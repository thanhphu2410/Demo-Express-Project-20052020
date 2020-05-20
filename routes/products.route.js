var express = require('express')
var shortid = require('shortid')
var router = express.Router()
var db = require('../db')
var page;
router.get('/', function(req, res){
    page = req.query.page || 1;
    var start = (page-1)*8;
    var end = page*8;
    var amount = db.get('account').find({ id: req.signedCookies.accountId}).get('cart.amount',0).value()
    res.render('prod/index',{
        page: parseInt(page),
        prods: db.get('products').value().slice(start,end),
        amount: amount 

})})


router.get('/cart/add/:id', function(req, res){
    var countItem = db.get('account').find({ id: req.signedCookies.accountId}).get('cart.amount',0).value()
    db.get('account').find({ id: req.signedCookies.accountId}).set('cart.amount',countItem + 1).write()
    var id = req.params.id;
    var products = db.get('products').find({id: id}).value()
    var account = db.get('account').find({ id: req.signedCookies.accountId}).value()
    req.body.id = account.id;
    req.body.prods = products;
    req.body.shortid = shortid.generate();
    db.get('cartItem').push(req.body).write()
    res.redirect('/products?page=' + page)
})

router.get('/cart',function(req, res){
    var account = db.get('cartItem').value()
    var filter = account.filter(function(x){
        return x.id === req.signedCookies.accountId
    }) 
    var subTotal = 0;
    for(var i=0;i<filter.length;i++){
        subTotal += parseFloat(filter[i].prods.price.slice(1));
    }
    subTotal = Math.round(subTotal * 100) / 100;
    if(filter.length == 0){
        res.render('prod/cart',{
            noti: 'Your cart is empty'
        })
        return;
    }
    res.render('prod/cart',{
        prods: filter,
        subTotal: subTotal
})})


router.get('/cart/:id', function(req, res){
    var id = req.params.id;
    var cartItem = db.get('cartItem').value()
    var filter = cartItem.filter(function(x){
        return x.id === req.signedCookies.accountId
    })
    var founded = filter.find(function(x){
        return x.prods.id === id;
    })
    var countItem = db.get('account').find({ id: req.signedCookies.accountId}).get('cart.amount').value()
    db.get('account').find({ id: req.signedCookies.accountId}).set('cart.amount',countItem - 1).write()
    db.get('cartItem').remove(founded).write()
    res.redirect('/products/cart')
})



module.exports = router