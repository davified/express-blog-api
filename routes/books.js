const express = require("express");
const router = express.Router();
const Book = require("../models/book");

//GET books listing. *tested working*
router.get("/", async (req, res, next) => {
  try {
    const displayAllBooks = await Book.find().populate("author");
    res.status(200).json(displayAllBooks);
  } catch (error) {
    next(error);
  }
});

// GET book by id *tested working*
router.get("/:id", async (req, res, next) => {
  try {
    const returnBookId = await Book.findById(req.params.id);
    res.status(200).json({
      book: returnBookId,
      message: `get book with id ${req.params.id}`
    });
  } catch (error) {
    next(error);
  }
});
// Post to create new book *tested working*
router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author
    });

    await newBook.save();

    res.json({
      id: newBook.id,
      message: `create new book using data from ${req.body.title}`
    });
  } catch (error) {
    next(error);
  }
});
// Put to edit book with id *tested working*
router.put("/:id", async (req, res, next) => {
  try {
    const updatedResult = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      result: updatedResult,
      message: `update book with id ${req.params.id}`
    });
  } catch (error) {
    next(error);
  }
});
// DELETE book with id *tested working*
router.delete("/:id", async (req, res, next) => {
  try {
    const deletedBook = await Book.findOneAndDelete({_id: req.params.id});
    res.json({
      result: deletedBook,
      message: `delete book with id ${req.params.id}`
    });
  } catch (error) {
    next(error);
  }
});

// DELETE book with title
router.delete("/:title", async (req, res, next) => {
  try {
    const deletedBook = await Book.findOneAndDelete(req.params.title);
    res.json({
      result: deletedBook,
      message: `delete book with title: ${req.params.title}`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
