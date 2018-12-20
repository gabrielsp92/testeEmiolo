var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {User} = require ('./models/user');


var app = express();

app.use(bodyParser.json());

//create user endpoint
app.post('/user',(req,res) => {
    var user = new User({
        name: req.body.name,
        age: req.body.age,
        login: req.body.login,
        pass: req.body.pass
    });

    user.save().then((doc) => {
        console.log(doc);
        res.send(doc);
    }, (e) => {
        console.log(e);
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});