// app/models/task.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	uid: String,
	username: String,
	mail: String,
	password: String,
	role: Number, // 0: none, 1: disabled, 2: user, 5: admin, 10: su
	favorite_tags: [String]
});

module.exports = mongoose.model('User', UserSchema);