var mongoose = require('mongoose');
var autopopulate = require("mongoose-autopopulate");

var User = require('./User');

var Schema = mongoose.Schema;

var studentSchema = new Schema({
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
}, { discriminatorKey: 'role' })

studentSchema.plugin(autopopulate);

module.exports = User.discriminator("Student", studentSchema);