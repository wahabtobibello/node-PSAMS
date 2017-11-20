const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const messageSchema = new Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: ObjectId,
    ref: "User",
    required: true,
    autopopulate: { select: "name.first name.last" },
    index:  true
  },
  to: {
    type: ObjectId,
    ref: "User",
    required: true,
    autopopulate: { select: "name.first name.last" },
    index: true
  },
}, { timestamps: true });

messageSchema.plugin(autopopulate);

module.exports = mongoose.model("Message", messageSchema);