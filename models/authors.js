const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = Schema({
  username: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const Author = mongoose.model("author", authorSchema);
module.exports = Author;
