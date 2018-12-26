const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

    //save to database, and returns auth token.
    return user.save().then(() => {
        return token;
    }).catch((err)=> {
        Promise.reject();
    })
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

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;


    return User.findOne({email}).then((user) => {
        if(!user){
           return Promise.reject();
        }

        //bcrypt only work with call backs
        return new Promise((resolve,reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                }else{
                    reject(err);
                }
            })
        });
    });
};

//will run before object.(save)
UserSchema.pre('save',function(next) {
    var user = this;
    
    if (user.isModified('password')){
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(user.password, salt, (err,hash) => {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};