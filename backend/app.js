const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8000;
const User = require('./models/user')
const date = new Date()



const dbURI = 'mongodb+srv://joellaprade:otrXifxg5qxYypK0@nextcluster.gmdlrli.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then(result => {
        app.listen(port)
        console.log('listening' + String(date.getHours()+1) + ":" + String(date.getMinutes()))
    })

app.get('/', (req, res) => {
    res.sendFile('/home/jlaprade/next.jlaprade.com/index.html');
})

app.get('/manage', (req, res) => {
    res.sendFile('/home/jlaprade/next.jlaprade.com/manage-events/manage-events.html');
})

app.get('/test', async (req, res) => {
    await new User({
        title: "title3",
        day: 3,
        start: {
            hour: 17,
            minute: 0
        },
        end: {
            hour: 18,
            minute: 30
        },
        tag: "31700",
    }).save()
    res.status(200).end('e')
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())












//insalar dependencies (sessions, mongoose, express)
//codear los fundamentos (conexion a db, middleware, ver como tengo ambos folders en next.jlaprade.com)