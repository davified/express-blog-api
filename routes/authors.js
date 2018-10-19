const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      age: req.body.age
    });

    await newAuthor.save();

    res.status(201).json({
      message: "successfully created new author"
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  const authors = await Author.find();
  res.json(authors);
});

router.get("/:id", async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({
      author: req.params.id
    });
    res.json({
      ...author.toJSON(),
      books: books
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body, {
        new: true
      }
    );
    res.json({
      ...updatedAuthor.toJSON(),
      message: `Author with id ${req.params.id} has been updated successfully`
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findOneAndRemove({
      _id: req.params.id
    });
    res.json({
      ...deletedAuthor.toJSON(),
      message: `Author with id ${req.params.id} has been deleted successfully`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;