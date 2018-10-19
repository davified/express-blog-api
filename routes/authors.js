const express = require("express");
const router = express.Router();
const Author = require("../models/author");

router.get("/", async (req, res, next) => {
  try {
    const results = await Author.find();
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const results = await Author.findById(req.params.id);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      age: req.body.age
    });
    await newAuthor.save();
    res.status(201).json({ message: `Saved author ${req.body.name}` });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const toUpdate = {
      name: req.body.name,
      age: req.body.age
    };
    const author = await Author.findByIdAndUpdate(req.params.id, toUpdate, {
      new: true
    });
    res.status(200).json(author);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Author.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Successfully deleted ${req.params.id}` });
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  res.json({message: err.message})
})
module.exports = router