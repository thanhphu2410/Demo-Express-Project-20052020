var express = require('express')
var User = require('../models/user.model')

var router = express.Router()

router.get('/', function(req, res){
    User.find().then(function(users){
        res.render('users/index',{
            users: users
        })
    })
})


router.get('/search', function(req, res){
    User.find().then(function(users){
        var q = req.query.q;
        var founded = users.filter(function(user){
            return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
        })
        res.render('users/index',{
            checkingSearch: 'CS',
            users: founded,
            q: q
        })
    })
})


router.get('/create', function(req, res){
    res.render('users/create')
})
router.post('/create',function(req, res){
    User.create(req.body).then(function(){
        res.redirect('/users')
    })
})


router.get('/:id', function(req, res){
    User.find().then(function(users){
        var id = req.params.id;
        var founded = users.find(function(user){
            return user.id === id;
        })
        res.render('users/view', {
            users: founded
        })
    })
})


router.get('/edit/:id', function(req, res){
    User.find().then(function(users){
        var id = req.params.id;
        var founded = users.find(function(user){
            return user.id === id;
        })
        res.render('users/edit', {
            users: founded
        })
    })
})
router.post('/edit/:id', function(req, res){
    User.updateOne({_id: req.params.id },req.body).then(function(){
        res.redirect('/users')
    })
})


router.get('/delete/:id', function(req, res){
    User.deleteOne({_id: req.params.id }).then(function(){
        res.redirect('/users')
    })
})


module.exports = router