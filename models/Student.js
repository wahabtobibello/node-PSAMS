var mongoose = require('mongoose');
var User = require('./User');
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  matricNumber: {
    type: Number,
    required: true,
    unique: true
  },
  supervisor: {
    type: ObjectID,
    ref: "Supervisor"
  }
})

module.exports = User.discriminator("Student", studentSchema);