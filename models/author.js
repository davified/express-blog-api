const mongoose = require("mongoose")
const { Schema } = mongoose;

const authorSchema = Schema({
  name: { type: String },
  verified: { type: String }
});

const Author = mongoose.model("Author", authorSchema)

module.exports = Author;