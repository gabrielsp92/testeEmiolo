const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        unique: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{Value} is not a valid email'
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 1,
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

//override method
//defines what will be sent back when a mongoose model is converted to json
UserSchema.methods.toJSON = function() {
    var user = this;
    // converts mongoose model to simple object
    var userObject = user.toObject();
    //uses lodash to pick attributes to be shown in json res.
    return _.pick(userObject, ['_id', 'email','name']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    //generate token with secret key "abc123"
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    //push to object`s token array
    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    //save to db and returns variable 'token' defined earlier
    return user.save().then(() => {
        return token;
    });
};

//static method that gets user by token
UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;


    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    //query nested object
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });


};

var User = mongoose.model('User', UserSchema);

module.exports = {User};