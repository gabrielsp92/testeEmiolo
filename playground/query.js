var {ObjectID} = require('mongodb');
var {mongoose} = require('/Users/gabrielsoarespereira/Desktop/JavaScript/Emiolo/testeEmiolo/server/db/mongoose.js');
var {User} = require ('/Users/gabrielsoarespereira/Desktop/JavaScript/Emiolo/testeEmiolo/server/models/user.js');

User.findById(new ObjectID('5c1cd8a83fe65b2e82dc6c66')).then((user) => {
    console.log('user');
}).catch((err) => {
    console.log(err);
});    