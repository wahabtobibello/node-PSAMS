var mongoose = require("mongoose");
var mongooseBcrypt = require("mongoose-bcrypt");
var Schema = mongoose.Schema;

var nameSchema = new Schema({
	first: {
		type: String,
		required: true
	},
	last: {
		type: String,
		required: true
	},
});
var userSchema = new Schema({
	name: nameSchema,
	password: {
		type: String,
		required: true,
		bcrypt: true
	}
}, { discriminatorKey: "role" });
userSchema.plugin(mongooseBcrypt);

module.exports = mongoose.model("User", userSchema);