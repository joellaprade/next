const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
const userSchema = new Schema({
    credentials: {
        username: String,
        password: String,
        cookie: String,
        authenticated: Boolean
    },
    events: {
        type: [{
            title: String,
            day: Number,
            start: {
                hour: Number,
                minute: Number,
                ampm: String
            },
            end: {
                hour: Number,
                minute: Number,
                ampm: String
            },
            tag: String
        }],
        default: []
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;


/*
const userSchema = new Schema({
    credentials: {
        username: String,
        password: String,
        cookie: String,
        authenticated: Boolean
    },
    events: [{
        title: String,
        day: Number,
        start: {
            hour: Number,
            minute: Number
        },
        end: {
            hour: Number,
            minute: Number
        },
        tag: String
    }]
})
*/