var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require ('./models/user');


var app = express();
app.use(bodyParser.json());

//CREATE user route
app.post('/user',(req,res) => {
    var body = _.pick(req.body,['name','email','password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);
    }).catch((err)=>{
        res.status(400).send(err);
    })

});

//FETCH ALL users route
app.get('/user', (req,res) => {
    User.find().then((users) => {
        res.send({users});  //send user as object instead of array
    }),(e) => {
        res.status(400).send(e);
    }
});

//Log in user route 
app.post('/signin',(req,res) => {
    var email = req.body.email;
    var pass = req.body.pass;

    User.findOne({email,pass}).then((doc) => {
        if(!doc){
            res.status(401).send();
        }
        user = new User(doc);

        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send({user});
    }).catch ((err) => {
        console.log(err);
    })
})


//Get user by id route
app.get('/user/:id', (req,res) => {
    var id = req.params.id;
    
    //check if the id sent is valid
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    //check if the user can be found
    User.findById(id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        //send object user in response
        res.send({user});
    }).catch((e) => {
        res.status(400).send();
    });


});

//auth middleware
var authenticate = (req, res, next) => {
    var token = req.header('auth');


    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user;
        req.token = token;

        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

//GET /me 
app.get('/me', authenticate, (req,res) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        res.send(user);
    }).catch((e) => {
        res.status(401).send();
    });
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};
//app: app