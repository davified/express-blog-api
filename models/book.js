const mongoose = require("mongoose");
const Author = require("./author");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    validate: {
      validator(authorId) {
        return Author.findById(authorId);
      }
    }
  }
});

module.exports = mongoose.model("Book", schema);