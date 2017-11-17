const mongoose = require("mongoose");

const User = require("./User");
const scheduleSchema = require("./Schedule").schema;

const Schema = mongoose.Schema;

const supervisorSchema = new Schema({
	staffNumber: {
		type: Number,
		required: true,
		unique: true
	},
	endDate: {
		type: Date,
		required: true,
		default: new Date(Date.now() + 5256000000)
	},
	dailySchedule: scheduleSchema
}, { discriminatorKey: "role" });

module.exports = User.discriminator("Supervisor", supervisorSchema);