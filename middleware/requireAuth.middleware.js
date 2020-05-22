var Account = require('../models/account.model')

module.exports.requireLogin = function(req, res, next){
    Account.find().then(function(account){
        var acc = account.find(function(x){
            return x.id === req.signedCookies.accountId;
        })
        if(!acc){
            res.redirect('/auth/login')
            return;
        }
        next();
    })
}