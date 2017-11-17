const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const appointmentSchema = new Schema({
  appointmentDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: ObjectId,
    ref: "Student",
    autopopulate: { select: "name.first name.last" },
    required: true,
    index: true
  },
  participants: {
    type: [{
      type: ObjectId,
      ref: "User",
      autopopulate: { select: "name.first name.last" }
    }],
    required: true
  }
}, { timestamps: true });

appointmentSchema.plugin(autopopulate);

module.exports = mongoose.model("Appointment", appointmentSchema);