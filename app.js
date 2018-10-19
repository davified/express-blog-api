if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const mongoose = require("mongoose")
const express = require("express");
const logger = require("morgan");

//body parser
const app = express();
app.use(logger("dev"));
app.use(express.json());

//models
const Book = require("./models/book")
const Author = require("./models/author")

//routes
const index = require("./routes/index");
const books = require("./routes/books");
const authors = require("./routes/authors");
app.use("/", index);
app.use("/books", books);
app.use("/authors", authors);

module.exports = app;
