const express = require("express");
const router = express.Router();
const Author = require("../models/authors");

router.get("/", async (req, res, next) => {
  try {
    const result = await Author.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const result = await Author.find({ _id: req.params.id });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author({
      username: req.body.username,
      age: req.body.age
    });
    await newAuthor.save();
    res.status(201).json({
      message: `${req.body.username} was successfully created`
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const result = await Author.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        age: req.body.age
      },
      {
        new: true
      }
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await Author.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// router.get("/:id", async (req, res, next) => {
//   try {
//     const author = await Author.findById(req.params.id);
//     const books = await Books.find({ author: req.params.id });
//     res.json({
//       ...Author.toJSON(),
//       books: books
//     });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
