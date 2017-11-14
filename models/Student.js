const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const User = require("./User");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
	matricNumber: {
		type: Number,
		required: true,
		unique: true
	},
	supervisor: {
		type: Schema.Types.ObjectId,
		ref: "Supervisor",
		required: true,
		autopopulate: true
	},
	profilePicture: Buffer,
	projectTopic: String
}, { discriminatorKey: "role" });

studentSchema.plugin(autopopulate);

module.exports = User.discriminator("Student", studentSchema);