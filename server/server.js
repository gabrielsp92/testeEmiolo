var {mongoose} = require('./db/mongoose');
var {User} = require ('./models/user');


var newUser = new User({
    name: 'Gabriel Soares',
    age: 25,
    login: 'gsoaresp',
    pass: '123'
})

newUser.save().then((doc) => {
    console.log("Saved user ",doc)
}, (e) => {
    console.log('Unable to save user', e);
});
