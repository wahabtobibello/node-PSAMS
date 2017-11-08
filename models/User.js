var mongoose = require('mongoose');
var mongooseBcrypt = require('mongoose-bcrypt');
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
  schoolIdNumber: {
    type: Number,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  }
});
userSchema.plugin(mongooseBcrypt);

module.exports.User = mongoose.model("User", userSchema);
module.exports.UserSchema = userSchema;