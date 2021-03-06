var {User} = require('./../models/user');


//AUTH middleware
var authenticate = (req, res, next) => {


    var token = req.headers['x-auth'];


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

module.exports = {authenticate};