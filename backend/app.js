const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./models/user')
const app = express();
const port = 8000;
const date = new Date()
const baseDir = `/home/jlaprade/next.jlaprade.com/`;
// const baseDir = `C:\\Users\\dell user 2\\Documents\\GitHub\\next\\`;

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

const isLogged = async (req) => {
    var cookie = req.cookies.id;
    var users = await User.find();
    var logged = false;
    users.forEach(user => {
        if(user.credentials.cookie == cookie && user.credentials.authenticated){
            logged = true;
        }
    })
    return logged;
}
const authenticate = async (req) => {
    var username = req.body.username;
    var password = req.body.password;
    var users = await User.find();
    var authenticated = false
    users.forEach(user => {
        if(username == user.credentials.username){
            if(password == user.credentials.password){
                authenticated = true;
            }
        }
    })
    return authenticated;
}




app.get('/', async (req, res) => {
    if(await isLogged(req)){
        res.sendFile(`${baseDir}home.html`);
    }else{
        res.sendFile(`${baseDir}login/login.html`);
    }
})

app.get('/registrarse', (req, res) => {
    res.sendFile(`${baseDir}register/register.html`);
})

app.get('/ingresar', (req, res) => {
    res.sendFile(`${baseDir}login/login.html`);
})

app.post('/create-user', async (req, res) => {
    await new User({
        credentials: {
            username: req.body.username,
            password: req.body.password,
            cookie: createCookie(res),
            authenticated: true
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

app.post('/login', async (req, res) => {
    if(await authenticate(req)){
        var users = await User.find()
        users.forEach(async user => {
            if(user.credentials.username == req.body.username){
                const cookie = createCookie(res);
                user.credentials.cookie = cookie
                user.credentials.authenticated = true;
                await user.save();
            }
        })
        res.send('done')
    }else {
        res.send('denied')
    }
})

app.get('/administrar-tareas', (req, res) => {
    res.sendFile(`${baseDir}manage-events/manage-events.html`)
})












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