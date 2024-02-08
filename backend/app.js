const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user')
const app = express();
const port = 8000;
const date = new Date()

const dbURI = 'mongodb+srv://joellaprade:otrXifxg5qxYypK0@nextcluster.gmdlrli.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then(result => {
        app.listen(port)
        console.log('listening' + String(date.getHours()+1) + ":" + String(date.getMinutes()))
    })


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(session({
    secret: 'jlapraderules',
    cookie: {maxAge: 30000},
    saveUninitialized: false
}))




app.get('/', (req, res) => {
    // console.log(req.sessionID)
    // res.send(200)
    //res.sendFile('/home/jlaprade/next.jlaprade.com/index.html');
})

app.get('tasks', (req, res) => {
    res.sendFile('/home/jlaprade/next.jlaprade.com/index.html');
})

app.get('/manage', (req, res) => {
    res.sendFile('/home/jlaprade/next.jlaprade.com/manage-events/manage-events.html');
})

app.get('/test', async (req, res) => {
    console.log(req.sessionID)
    res.send(200)
})













//insalar dependencies (sessions, mongoose, express)
//codear los fundamentos (conexion a db, middleware, ver como tengo ambos folders en next.jlaprade.com)