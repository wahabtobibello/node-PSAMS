const mongoose = require("mongoose");
const mongooseBcrypt = require("mongoose-bcrypt");
const Schema = mongoose.Schema;

const nameSchema = new Schema({
	first: {
		type: String,
		required: true
	},
	last: {
		type: String,
		required: true
	},
});
const userSchema = new Schema({
	name: nameSchema,
	password: {
		type: String,
		required: true,
		bcrypt: true
	}
}, { discriminatorKey: "role" });
userSchema.plugin(mongooseBcrypt);

module.exports = mongoose.model("User", userSchema);