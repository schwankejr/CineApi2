const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/cineApi', {
    
    
});


mongoose.Promise = global.Promise;


module.exports = mongoose;
