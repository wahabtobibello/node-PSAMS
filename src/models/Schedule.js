const mongoose = require("mongoose");
const moment = require("moment");

const daysOfTheWeek = require("../helpers").daysOfTheWeek;

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  day: {
    type: String,
    required: true,
    lowercase: true,
    enum: daysOfTheWeek
  },
  maxNumberOfAppointments: {
    type: Number,
    default: Infinity
  },
  period: {
    from: {
      type: String,
      match: /((0[89]|1[0-6]):[0-5]\d|17:00)/,
      default: "08:00"
    },
    to: {
      type: String,
      match: /((0[89]|1[0-6]):[0-5]\d|17:00)/,
      default: "17:00"
    }
  }
});

scheduleSchema.pre("validate", function (next) {
  if (moment(this.period.from, "HH:mm").isSameOrAfter(moment(this.period.to, "HH:mm"))) {
    next(new Error("End Time must be greater than Start Time"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Schedule", scheduleSchema);