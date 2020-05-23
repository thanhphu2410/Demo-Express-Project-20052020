var express = require('express')
var router = express.Router()

var Product = require('../models/product.model')
var Account = require('../models/account.model')
var Item = require('../models/item.model')

var page;
router.get('/', function(req, res){
    Product.find().then(function(products){
        Account.find().then(function(account){
            var findAccount = account.find(function(x){
                return x.id === req.signedCookies.accountId
            });
            page = req.query.page || 1;
            var start = (page-1)*8;
            var end = page*8;
            res.render('prod/index',{
                page: parseInt(page),
                prods: products.slice(start,end),
                amount: findAccount.cartItem
            })
        })
    })
})


router.get('/cart/add/:id', function(req, res){
    Account.find().then(function(account){
        var id = req.params.id;
        Product.find({_id: id}).then(function(products){
            var findAccount = account.find(function(x){
                return x.id === req.signedCookies.accountId
            });
            Account.updateOne({id: req.signedCookies.accountId},{cartItem: parseInt(findAccount.cartItem) + 1}).then(function(err){
                if(err) return;
            })
            req.body.id = findAccount.id;
            req.body.prods = products[0].id;
            Item.create({id: findAccount.id, prods:  products[0]}).then(function(err){
                if(err) return;
            })
            res.redirect('/products?page=' + page)
        })
    })
})

router.get('/cart',function(req, res){
    Item.find().then(function(items){
        var filter = items.filter(function(x){
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
        })
    })
})


router.get('/cart/:id', function(req, res){
    Item.find().then(function(items){
        var id = req.params.id;
        var filter = items.filter(function(x){
            return x.id === req.signedCookies.accountId
        }) 
        var founded = filter.find(function(x){
            return x.prods._id == id;
        })
        Account.find().then(function(account){
            var findAccount = account.find(function(x){
                return x.id === req.signedCookies.accountId
            });
            Account.updateOne({id: req.signedCookies.accountId},{cartItem: parseInt(findAccount.cartItem) - 1}).then(function(err){
                if(err) return;
            })
        })
        Item.deleteOne(founded).then(function(){
            res.redirect('/products/cart')
        })
    })
})



module.exports = router