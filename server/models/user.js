var mongoose = require('mongoose');

var User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    login: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    pass: {
        type: String,
        required: true,
        minlength: 1,
    } 
})

module.exports = {User};