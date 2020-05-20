require('dotenv').config()

var express = require('express')
var cookieParser = require('cookie-parser')
var app = express()
var port = 3000

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
    var account = db.get('account').find({ id: req.signedCookies.accountId}).value();
    res.render('index',{
        account: account
})})

app.use('/users',requireAuth.requireLogin,usersRoute)
app.use('/auth',authRoute)
app.use('/products',prodRoute)


app.use(express.static('public'))
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))