const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const mongoose = require("mongoose");

/* GET books listing. */
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find().populate("author");
    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  res.json({ message: `get book with id ${req.params.id}` });
});

router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author
    });

    await newBook.save();

    res.status(201).json({ message: `created a new book successfully` });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", (req, res, next) => {
  res.json({ message: `update book with id ${req.params.id}` });
});

router.delete("/:id", (req, res, next) => {
  res.json({ message: `delete book with id ${req.params.id}` });
});

module.exports = router;
