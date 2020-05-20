var db = require('../db')
module.exports.requireLogin = function(req, res, next){
    if(!req.signedCookies.accountId || req.signedCookies.accountId == 1 ){
        res.redirect('/auth/login')
        return;
    }
    var account = db.get('account').find({id: req.signedCookies.accountId}).value();
    if(!account){
        res.redirect('/auth/login')
        return;
    }
    next();
}