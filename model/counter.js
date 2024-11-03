const mongo = require("mongoose");
const schema = mongo.Schema;

const counterSchema = new schema({
  key: {
    type: String,
    unique: true,
  },
  value: Number,
});

const counter = mongo.model("counter", counterSchema, "counter");
module.exports = counter;
