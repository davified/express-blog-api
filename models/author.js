const mongoose = require("mongoose");
const { Schema } = mongoose;

const authorSchema = Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
