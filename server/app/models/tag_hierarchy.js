// app/models/task.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TagHierarchySchema   = new Schema({
	name: String,
	parent: String,
	flags: [String],
	order: Number
});

module.exports = mongoose.model('TagHierarchy', TagHierarchySchema);