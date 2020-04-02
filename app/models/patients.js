var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pSchema = new Schema({
	name: {type: String},
	birthDate: {type: String},
	infection: {type: String},
	date: {type:String},
	travelRoute: {type: String},
	note: {type: String},
	tid: {type: String},
	pid: {type: String},
	cid: {type: String},
	timestamp: {type: String}
});

module.exports = mongoose.model('Patients', pSchema);
