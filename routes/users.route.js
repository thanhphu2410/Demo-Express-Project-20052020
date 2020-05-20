var express = require('express')
var shortid = require('shortid')
var db = require('../db')


var router = express.Router()



router.get('/', function(req, res){
    res.render('users/index',{
        users: db.get('users').value()
})})
router.get('/search', function(req, res){
    var q = req.query.q;
    var users = db.get('users').value();
    var founded = users.filter(function(user){
        return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    })
    res.render('users/index', {
        users: founded,
        q: q
    })
})
router.get('/create', function(req, res){
    res.render('users/create')
})
router.get('/:id', function(req, res){
    var id = req.params.id;
    var users = db.get('users').value();
    var founded = users.find(function(user){
        return user.id === id;
    })
    res.render('users/view', {
        users: founded
    })
})
router.get('/edit/:id', function(req, res){
    var id = req.params.id;
    var users = db.get('users').value();
    var founded = users.find(function(user){
        return user.id === id;
    })
    res.render('users/edit', {
        users: founded
    })
})
router.post('/edit/:id', function(req, res){
    if(req.body.name == ''||req.body.phone == ''||req.body.address == ''||req.body.grade == ''){
        res.render('users/edit',{
            error: 'Missing information! Please check',
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            grade: req.body.grade
        })
        return;
    }
    db.get('users').find({ id: req.params.id }).assign(req.body).write()
    res.redirect('/users')
})
router.post('/delete/:id', function(req, res){
    var id = req.params.id;
    var users = db.get('users').value();
    var founded = users.find(function(user){
        return user.id === id;
    })
    db.get('users').remove(founded).write()
    res.redirect('/users')
})
router.post('/create',function(req, res){
    if(req.body.name == ''||req.body.phone == ''||req.body.address == ''||req.body.grade == ''){
        res.render('users/create',{
            error: 'Missing information! Please check',
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            grade: req.body.grade
        })
        return;
    }
    req.body.id = shortid.generate();
    db.get('users').push(req.body).write()
    res.redirect('/users')
})

module.exports = router