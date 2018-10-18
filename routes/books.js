const express = require("express");
const router = express.Router();
const Book = require("../models/book");

/* GET books listing. */
router.get("/", async (req, res, next) => {
  try {
    const results = await Book.find();
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const results = await Book.findById(req.params.id);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author
    });
    await newBook.save(newBook);
    res.status(201).json({ message: `Saved ${req.body.title}` });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const toUpdate = {
      title: req.body.title,
      author: req.body.author
    };
    const book = await Book.findByIdAndUpdate(req.params.id, toUpdate, {
      new: true
    });
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Successfully deleted ${req.params.id}` });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
module.exports = router;
