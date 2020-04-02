var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var pSchema = new Schema({
	name: {type: String},
	age: {type: String},
	address: {type: String},
});

module.exports = mongoose.model('Patients', pSchema);
