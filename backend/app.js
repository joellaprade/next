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
    var authenticated = false
    var users = await User.find();
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
    var cookie = req.cookies.id;
    var event = req.body;
    var users = await User.find();
    users.forEach(async user => {
        if(user.credentials.cookie == cookie){
            user.events.push(event);
            await user.save();
        }
    })
    res.send(200)
})

app.put('/edit-event/:id', async (req, res) => {
    var eventId = req.params.id;
    var cookie = req.cookies.id;
    var event = req.body;
    var users = await User.find();
    users.forEach(async user => {
        if(user.credentials.cookie == cookie){
            for(i = 0; i < user.events.length; i++){
                if(user.events[i]._id == eventId){
                    user.events[i] = event
                    await user.save();
                }
            }
        }
    })
    res.send(200)
})

app.delete('/delete-event/:id', async (req, res) => {
    var eventId = req.params.id;
    var cookie = req.cookies.id;
    var users = await User.find();
    console.log(eventId, cookie)
    users.forEach(async user => {
        if(user.credentials.cookie == cookie){
            for(i = 0; i < user.events.length; i++){
                if(user.events[i]._id == eventId){
                    console.log(user.events)
                    user.events.splice(i, 1)
                    console.log(user.events)
                    await user.save();
                }
            }
        }
    })
    res.send(200)
})

app.get('/get-events', async (req, res) => {
    var cookie = req.cookies.id;
    var users = await User.find();
    users.forEach(user => {
        if(user.credentials.cookie == cookie){
            res.send(user.events)
        }
    })
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

app.get('/administrar', async (req, res) => {
    if(await isLogged(req)){
        res.sendFile(`${baseDir}manage-events/manage-events.html`)
    }else{
        res.sendFile(`${baseDir}login/login.html`);
    } 
})