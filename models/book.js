const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = Schema({
  title: { type: String },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    validate: {
      validator(authorId) {
        return Author.findById(authorId)
      }
    }
  },
  publised_year: { type: Number }
});

//create model
const Book = mongoose.model("Book", bookSchema)

module.exports = Book