var mongoose = require("mongoose");
var User = require("./User");
var Schema = mongoose.Schema;

var supervisorSchema = new Schema({
	staffNumber: {
		type: Number,
		required: true,
		unique: true
	},
	endDate: {
		type: Date,
		required: true,
		default: new Date(Date.now() + 5256000000)
	}
}, { discriminatorKey: "role" });

module.exports = User.discriminator("Supervisor", supervisorSchema);