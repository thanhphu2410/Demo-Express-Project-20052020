require('dotenv').config()

var express = require('express')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose')
var app = express()
var port = 3000

var Account = require('./models/account.model')

mongoose.connect(process.env.MONGO_URL);

var usersRoute = require('./routes/users.route')
var authRoute = require('./routes/auth.route')
var prodRoute = require('./routes/products.route')

var requireAuth = require('./middleware/requireAuth.middleware')

app.use(express.json()) 
app.use(express.urlencoded({ extended: true })) 
app.use(cookieParser(process.env.SESSION_SECRET))



app.set('view engine', 'pug')
app.set('views', './views')

app.get('/',requireAuth.requireLogin, function(req, res){
    Account.find().then(function(account){
        var acc = account.find(function(x){
            return x.id === req.signedCookies.accountId;
        })
        res.render('index',{
            account: acc
        })
    })
})

app.use('/users',requireAuth.requireLogin,usersRoute)
app.use('/auth',authRoute)
app.use('/products',prodRoute)


app.use(express.static('public'))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))