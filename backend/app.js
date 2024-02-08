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


/*
hacer el authentication en cada request, y hacerlo antes de mandar lo que sea
basicamente, vemos el estado de auth, y dependeindo de este le mandamos un login o el index.html
*/

app.get('/', (req, res) => {
    // console.log(req.sessionID)
    // res.send(200)
    //res.sendFile('/home/jlaprade/next.jlaprade.com/index.html');
    res.sendFile('/home/jlaprade/next.jlaprade.com/index.html');
})

app.get('/registrarse', (req, res) => {
    res.sendFile('/home/jlaprade/next.jlaprade.com/register/register.html');
})

app.get('/manage', (req, res) => {
    res.sendFile('/home/jlaprade/next.jlaprade.com/manage-events/manage-events.html');
})

app.get('/test', async (req, res) => {
    
    console.log(req.sessionID)
    res.send(200)
})




/*
await new User({
        credentials: {
            username: 'jlaprade',
            password: 'today2428',
            cookie: 'eiodfjgposdfg',
            authenticated: 'false'
        },
        events: {
            title: 'Evento 1',
            day: 1,
            start: {
                hour: 8,
                minute: 30
            },
            end: {
                hour: 9,
                minute: 0
            },
            tag: '232352'
        }
    }).save()
*/