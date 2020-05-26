var express = require('express')
var Chatbox = require('../models/chatbox.model')
var Account = require('../models/account.model')

var router = express.Router()

router.get('/', function(req, res){
    Account.find().then(function(account){
        var q = req.query.q;
        if(q){
            var founded = account.filter(function(x){
                return x.name.toLowerCase().indexOf(q.toLowerCase()) !== -1 && x.id !== req.signedCookies.accountId;
            })
            Chatbox.find().then(function(chats){
                var chat = chats.filter(function(x){
                    return x.id_1 === req.signedCookies.accountId || x.id_2 === req.signedCookies.accountId; 
                })
                var acc = account.filter(function(x){
                    for(var i of chat){
                        if(i.id_1 === x.id||i.id_2 === x.id){
                            return i.id_1 === x.id||i.id_2 === x.id;
                        }
                    }
                })
                console.log(acc);
                
                res.render('chatbox/index',{
                    users: founded,
                    q: q,
                    chat: chat

                })
            })
            return;
        }
        Chatbox.find().then(function(chats){
            var chat = chats.filter(function(x){
                return x.id_1 === req.signedCookies.accountId || x.id_2 === req.signedCookies.accountId; 
            })
            var acc = account.filter(function(x){
                for(var i of chat){
                    if(i.id_1 === x.id && i.id_1 !== req.signedCookies.accountId || i.id_2 === x.id && i.id_2 !== req.signedCookies.accountId){
                        return i.id_1 === x.id && i.id_1 !== req.signedCookies.accountId || i.id_2 === x.id && i.id_2 !== req.signedCookies.accountId;
                    }
                }
            })
            res.render('chatbox/index',{
                recent: acc
            })
        })
        
    })
})

router.get('/:id', function(req, res){
    Chatbox.find().then(function(chats){
        var check = undefined;
        var chat = chats.find(function(x){
            if(x.id_1 == req.signedCookies.accountId && x.id_2 == req.params.id){
                check = 'Case 1';
                return x.id_1 == req.signedCookies.accountId && x.id_2 == req.params.id;
            }
            if(x.id_2 == req.signedCookies.accountId && x.id_1 == req.params.id){
                check = 'Case 2';
                return x.id_2 == req.signedCookies.accountId && x.id_1 == req.params.id;
            }
        })
        
        if(check == 'Case 2'){
            Account.find().then(function(account){
                var acc = account.find(function(x){
                    return x.id === req.params.id;
                })
                var recent = chats.filter(function(x){
                    return x.id_1 === req.signedCookies.accountId || x.id_2 === req.signedCookies.accountId; 
                })
                var accRecent = account.filter(function(x){
                    for(var i of recent){
                        if(i.id_1 === x.id && i.id_1 !== req.signedCookies.accountId && i.id_1 !== req.params.id ||
                            i.id_2 === x.id && i.id_2 !== req.signedCookies.accountId && i.id_2 !== req.params.id ){
                            return i.id_1 === x.id && i.id_1 !== req.signedCookies.accountId && i.id_1 !== req.params.id ||
                            i.id_2 === x.id && i.id_2 !== req.signedCookies.accountId && i.id_2 !== req.params.id;
                        }
                    }
                })
                console.log(accRecent);
                
                res.render('chatbox/inbox',{
                    users: acc,
                    inbox: chat,
                    recent: accRecent
                })
            })
            return;
        }

        else{
            Account.find().then(function(account){
                var acc = account.find(function(x){
                    return x.id === req.params.id;
                })
                var recent = chats.filter(function(x){
                    return x.id_1 === req.signedCookies.accountId || x.id_2 === req.signedCookies.accountId; 
                })
                var accRecent = account.filter(function(x){
                    for(var i of recent){
                        if(i.id_1 === x.id && i.id_1 !== req.signedCookies.accountId && i.id_1 !== req.params.id ||
                            i.id_2 === x.id && i.id_2 !== req.signedCookies.accountId && i.id_2 !== req.params.id ){
                            return i.id_1 === x.id && i.id_1 !== req.signedCookies.accountId && i.id_1 !== req.params.id ||
                            i.id_2 === x.id && i.id_2 !== req.signedCookies.accountId && i.id_2 !== req.params.id;
                        }
                    }
                })
                console.log(accRecent);
                res.render('chatbox/inbox',{
                    users: acc,
                    chat: chat,
                    recent: accRecent
                })
            })
        }
        
    })
})

router.post('/:id', function(req, res){
    Chatbox.find().then(function(chats){
        var check = undefined;
        var acc = chats.find(function(x){
            if(x.id_1 == req.signedCookies.accountId && x.id_2 == req.params.id){
                check = 'Case 1';
                return x.id_1 == req.signedCookies.accountId && x.id_2 == req.params.id;
            }
            if(x.id_2 == req.signedCookies.accountId && x.id_1 == req.params.id){
                check = 'Case 2';
                return x.id_2 == req.signedCookies.accountId && x.id_1 == req.params.id;
            }
        })

        if(acc){
            if(check == 'Case 2'){
                var SorR = acc.SorR + 'r';
                var chats = acc.chats;
                var day = acc.date;
                var today = new Date();
                var date = today.getHours() + ":" + today.getMinutes() +' | '
                + today.getDate() + '-'+(today.getMonth()+1) + '-' + today.getFullYear();

                chats[chats.length] = req.body.mess;
                day[day.length] = date;
                
                Chatbox.updateOne({_id: acc._id},{chats: chats}).then(function(err){
                    if(err) return;
                })
                Chatbox.updateOne({_id: acc._id},{SorR: SorR}).then(function(err){
                    if(err) return;
                })
                Chatbox.updateOne({_id: acc._id},{date: day}).then(function(err){
                    if(err) return;
                })
                res.redirect('/chatbox/' + req.params.id)
                return;
            }
    
            else{
                var SorR = acc.SorR + 's';
                var chats = acc.chats;
                var day = acc.date;
                var today = new Date();
                var date = today.getHours() + ":" + today.getMinutes() + ' | '
                + today.getDate() + '-'+ (today.getMonth()+1) + '-' + today.getFullYear();

                chats[chats.length] = req.body.mess;
                day[day.length] = date;
    
                Chatbox.updateOne({_id: acc._id},{chats: chats}).then(function(err){
                    if(err) return;
                })
                Chatbox.updateOne({_id: acc._id},{SorR: SorR}).then(function(err){
                    if(err) return;
                })
                Chatbox.updateOne({_id: acc._id},{date: day}).then(function(err){
                    if(err) return;
                })
                res.redirect('/chatbox/' + req.params.id)
                return;
            }
        }
        var today = new Date();
        var date = today.getHours() + ":" + today.getMinutes() +' | '
        +today.getDate() + '-'+(today.getMonth()+1) + '-' + today.getFullYear();
        req.body.id_1 = req.signedCookies.accountId;
        req.body.id_2 = req.params.id;
        req.body.date = [[date]];
        req.body.SorR = 's';
        req.body.chats = [[req.body.mess]];
        
        Chatbox.create(req.body).then(function(){
            res.redirect('/chatbox/' + req.params.id)
        })
        
    })
    
})

module.exports = router