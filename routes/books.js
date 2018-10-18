const express = require("express");
const router = express.Router();

const Book = require("../models/book")

/* GET books listing. */
router.get("/", async (req, res, next) => {
  try {
    let result = await Book.find().populate("author")
    res.status(200).json(result);
  } catch (error) {
    next(new error(`unable to retrive all books from db`))
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    await Book.findById(req.params.id)
    res.status(200).json({ message: `get book with id ${req.params.id}` });
  } catch (error) {
    next(new error(`unable to find book with title ${req.body.title}`))
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      published_year: req.body.published_year
    })
    await newBook.save()
    res.status(201).json({ message: `created new book from ${req.body.title}` });
  } catch (error) {
    next(new error(`unable to create book with title ${req.body.title}`))
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      published_year: req.body.published_year
    })
    res.status(200).json({ message: `update book with id ${req.body.title}` });
  } catch (error) {
    next(new error(`unable to update book with title ${req.body.title}`))
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: `deleted book with title ${req.body.title}` })
  } catch (error) {
    next(new error(`unable to delete book with title ${req.body.title}`))
  }
});

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = router;
