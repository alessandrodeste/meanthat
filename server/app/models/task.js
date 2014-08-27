// app/models/task.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ReplySchema   = new Schema({
	uid: String,
	user: String,
	descr: String,
	updated: { type: Date, default: Date.now }
});

var CommentSchema   = new Schema({
	uid: String,
	user: String,
	descr: String,
	type: { type: Number, default: 0 }, // 0: note, 1: question, 2: issue, 3: important, 4: documentation
	status: { type: Number, default: 0 }, // 0: ok, 1: resolved, 2: to resolve
	updated: { type: Date, default: Date.now },
	replies: [ReplySchema] // enabled only for questions & issues
});

var AssignToSchema   = new Schema({
	user: String,
	updated: { type: Date, default: Date.now },
	role: Number // 0: read only, 5: &comment, 10: &edit, 15: &delete
});

var DocumentSchema   = new Schema({
	uid: String,
	binary: Buffer,
	flags: [String],
	type: String,
	note: String,
	descr: String,
	filename: String
});

var TaskSchema   = new Schema({
	uid: String,
	user: String,
	created: { type: Date, default: Date.now },
	updated: { type: Date, default: Date.now },
	title: String,
	descr: String,
	note: String,
	type: { type: Number, default: 0 }, // 0: task
	perc: { type: Number, default: 0 }, // percent completed
	tags: [String], // keyword prefix: company_*, prj_*, brench_*, !_*, ?_*
	referrer: [String], // like tags, but with code or externals ref (ex: "svn:145", "www.xyz.y/123")
	assign_to: [AssignToSchema],
	comments: [CommentSchema],
	documents: [DocumentSchema],
	fg_close: Boolean,
	fg_archived: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);