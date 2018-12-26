var mongoose = require('mongoose');
//removing warning
mongoose.set('useNewUrlParser',true);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/teste-emiolo');

module.exports = {
    mongoose: mongoose
};