var mongoose = require('mongoose');
var User = require('./User');
var Schema = mongoose.Schema;

var supervisorSchema = new Schema({
  staffNumber: {
    type: Number,
    required: true,
    unique: true
  }
})

module.exports = User.discriminator("Supervisor", supervisorSchema);