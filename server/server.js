var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require ('./models/user');
var {authenticate} = require('./middleware/authenticate');

//removing DeprecationWarning.
mongoose.set('useCreateIndex', true);

//express module setup.
var app = express();
app.use(bodyParser.json());

//CREATE user route.
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

//GET ALL users route.
app.get('/user', (req,res) => {
    User.find().then((users) => {
        res.send({users});  //send user as object instead of array
    }),(e) => {
        res.status(400).send(e);
    }
});

//GET user by id route
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

//Log in user route 
app.post('/user/login',(req,res) => {
    var body = _.pick(req.body,['email','password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth',token).send(user);
        });
    }).catch((err) => {
        res.status(401).send();
    })
});

///PRIVATE ROUTES

//GET /me  
app.get('/me', authenticate, (req,res) => {
    res.send(req.user);
});

//log out route
app.delete('/user/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch((e) => {
        res.send(400).send();
    })
});


app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};
//app: app