const mongoose = require("mongoose")
const { Schema } = mongoose;

const authorSchema = Schema({
  name: { type: String },
  occupation: { type: String },
});

const Author = mongoose.model("Author", authorSchema)

module.exports = Author;