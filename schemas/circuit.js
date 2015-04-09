var mongoose = require('mongoose');

module.exports = mongoose.model('Circuit',{
	userID : String,
	circuitID : String,
	components : String,
	createdAt : String,
	updatedAt : String
});