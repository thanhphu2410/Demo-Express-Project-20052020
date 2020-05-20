var express = require('express')
var multer  = require('multer')
var shortid = require('shortid')
var md5 = require('md5')
var db = require('../db')

var router = express.Router()
var upload = multer({ dest: './public/uploads/' })

router.get('/login', function(req, res){
    res.render('auth/login')
})
router.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var account = db.get('account').find({username: username}).value();
    var hashedPassword = md5(req.body.password);
    if(!account ||username !== account.username || hashedPassword !== account.password){
        res.render('auth/login',{
            error: 'Invalid username or password!',
            username: req.body.username,
            password: req.body.password
        })
        return;
    }
    res.cookie('accountId',account.id,{
        signed: true
    })
    res.redirect('/')
})


router.get('/register', function(req, res){
    res.render('auth/register')
})

router.post('/register',upload.single('avatar'),function(req, res){
    if(req.body.username == ''||req.body.password == ''||req.body.name == ''||req.body.phone == ''){
        res.render('auth/register',{
            error: 'Missing information! Please check',
            name: req.body.name,
            phone: req.body.phone
        })
        return;
    }
    var founded  = db.get('account').find({ username: req.body.username}).value();
    if(founded){
        res.render('auth/register',{
            error: 'Username already used',
            name: req.body.name,
            phone: req.body.phone
        })
        return;
    }
    req.body.id = shortid.generate();
    req.body.password = md5(req.body.password);
    req.body.avatar = req.file.path.split('\\').slice(1).join('\\');
    db.get('account').push(req.body).write()
    res.redirect('/auth/login')
})


router.get('/:id', function(req, res){
    var account = db.get('account').find({ id: req.params.id}).value();
    if(!account){
        res.redirect('/auth/login')
        return;
    }
    var image = "http://localhost:3000/" +  account.avatar;
    res.render('auth/info',{
        account: account,
        image: image
})})


router.post('/logout', function(req, res){
    res.clearCookie('accountId')
    res.redirect('/')
})

module.exports = router