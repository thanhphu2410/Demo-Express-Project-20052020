var express = require('express')
var multer  = require('multer')
var shortid = require('shortid')
var md5 = require('md5')
var cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Api_Key,
    api_secret: process.env.Api_Secret
});

var Account = require('../models/account.model')

var router = express.Router()
var upload = multer({ dest: './public/uploads/' })

router.get('/login', function(req, res){
    res.render('auth/login')
})
router.post('/login',function(req,res){
    Account.find().then(function(account){
        var username = req.body.username;
        var hashedPassword = md5(req.body.password);
        var acc = account.find(function(x){
            return x.username === username
        })
        if(!acc ||username !== acc.username || hashedPassword !== acc.password){
            res.render('auth/login',{
                error: 'Invalid username or password!',
                username: req.body.username,
                password: req.body.password
            })
            return;
        }
        res.cookie('accountId',acc.id,{
            signed: true
        })
        res.redirect('/')
    })
})


router.get('/register', function(req, res){
    res.render('auth/register')
})

router.post('/register',upload.single('avatar'),function(req, res){
    Account.find().then(function(account){
        var username = req.body.username;
        var acc = account.find(function(x){
            return x.username === username
        })
        if(acc){
            res.render('auth/register',{
                error: 'Username already used',
                name: req.body.name,
                phone: req.body.phone
            })
            return;
        }
        req.body.id = shortid.generate();
        req.body.password = md5(req.body.password);
        req.body.cartItem = '0';
        cloudinary.uploader.upload(req.file.path,function(result){
            req.body.avatar = result.url;
            Account.create(req.body).then(function(err){
                if(err) return;
            })
        })
        res.redirect('/auth/login')
    })
})


router.get('/:id', function(req, res){
    Account.find().then(function(account){
        var acc = account.find(function(x){
            return x.id === req.params.id;
        })
        if(!acc){
            res.redirect('/auth/login')
            return;
        }
        res.render('auth/info',{
            account: acc
        })
    })
})


router.post('/logout', function(req, res){
    res.clearCookie('accountId')
    res.redirect('/')
})

module.exports = router