var mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI  || 'mongodb://localhost');

module.exports = mongoose.connection;
