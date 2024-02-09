const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./models/user')
const app = express();
const port = 8000;
const date = new Date()
// const baseDir = `/home/jlaprade/next.jlaprade.com/`;
const baseDir = `C:\\Users\\dell user 2\\Documents\\GitHub\\next\\`;

const dbURI = 'mongodb+srv://joellaprade:otrXifxg5qxYypK0@nextcluster.gmdlrli.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURI)
    .then(result => {
        app.listen(port)
        console.log('listening' + String(date.getHours()+1) + ":" + String(date.getMinutes()))
    })

app.use(express.static(baseDir));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())




const createCookie = (res) => {
    var year = date.getFullYear().toString();
    var month = date.getMonth().toString();
    var day = date.getDay().toString();
    var hour = date.getHours().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds().toString();
    var random = Math.floor(Math.random()*100).toString();
    var cookie = year+month+day+hour+minute+second+random;

    res.cookie('id', cookie, {
        maxAge: 80000000,
        httpOnly: true,
        secure: true
    })

    return cookie;
}

const authenticate = async (req, res) => {
    console.log(req.cookies.id)
    if(req.cookies.id){
        console.log('ran2')
        // var users = await User.find();
        // users.forEach(user => {
        //     console.log('ran3')
        //     console.log(user.cookie, req.cookies.id)
        //     if(user.cookie == req.cookies.id){
        //         console.log('found');
        //     }
        // })
    }else {
        res.sendFile(`${baseDir}/register/register.html`)
        //mandar login html
        //no necesariament crear el cookie ahi, sino en register
    }
}
//createCookie(res);
//formalizar la creacion y validacion de cookies
//asignarlas a usuarios para tener event arrqays distintos


app.get('/', (req, res) => {
    //authenticate(req, res);
    res.sendFile(`${baseDir}home.html`);
})

app.get('/registrarse', (req, res) => {
    res.sendFile(`${baseDir}register/register.html`);
})

app.post('/create-user', async (req, res) => {
    await new User({
        credentials: {
            username: req.body.username,
            password: req.body.password,
            cookie: createCookie(res),
            authenticated: false
        },
        events: []
    }).save()
    res.send('done');
})

app.post('/create-event', async (req, res) => {
    var user = await User.find();
    user[0].events.push({
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
    });
    await user[0].save();
    res.send(200)
})

app.post('login-user', (req, res) => {
    //authenticate(req)
})

app.get('/administrar-tareas', (req, res) => {
    res.sendFile(`${baseDir}manage-events/manage-events.html`)
})



/*

orden de auth
primero revisar cookie
despues ver si user existe
despues ver si la contra coincide

*/


/*
hacer el authentication en cada request, y hacerlo antes de mandar lo que sea
basicamente, vemos el estado de auth, y dependeindo de este le mandamos un login o el index.html
*/



/*
await new User({
        credentials: {
            username: 'jlaprade',
            password: 'today2428',
            cookie: 'eiodfjgposdfg',
            authenticated: 'false'
        },
        events: [{
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
        }]
    }).save()
*/