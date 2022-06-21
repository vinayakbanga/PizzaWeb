require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const session =require('express-session')
const flash =require('express-flash')
const MongoDbStore = require('connect-mongo')
// const Connect = require('')
// Assets 
app.use(express.static('public'))
app.use(express.json())



// Database connection
mongoose.connect(process.env.MONGO_URL);
mongoose.connection
    .once('open', function () {
      console.log('MongoDB running');
    })
    .on('error', function (err) {
      console.log(err);
    });


// Session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection: mongoose.connection,
//     collection: 'sessions'
// })



    //sessionn config

    app.use(session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store:MongoDbStore.create({
            mongoUrl:process.env.MONGO_URL
        }),
        
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
        // cookie: { maxAge: 1000 * 15 }

    }))

    app.use(flash())

//Global middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    next()

})
// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)




app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})