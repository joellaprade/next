const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    events: {
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
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;