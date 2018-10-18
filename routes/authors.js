const express = require("express");
const router = express.Router();
const Author = require("../models/author");

//GET > list all 
router.get("/", async (req, res, next) => {
  try {
    const result = await Author.find().populate("author")
    res.status(200).json(result)
  } catch (error) {
    next(new Error(`unable to retrieve authors`))
  }
});

//POST > create
router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      verified: req.body.verified
    })
    await newAuthor.save();
    res.status(201).json({ message: `new Author record successfully created` })
  } catch (error) {
    next(new Error(`unable to create new author entry for ${req.body.name}`))
  }
});

//PUT > update
router.put("/:id", async (req, res, next) => {
  try {
    await Author.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      verified: req.body.verified
    })
    res.status(200).json({ message: `successfully updated details for ${req.body.name}` })
  } catch (error) {
    next(new Error(`unable to update details for ${req.body.name}`))
  }
});

//GET with id
router.get("/:id", async (req, res, next) => {
  try {
    let result = await Author.findById(req.params.id)
    res.status(200).json(result)
  } catch (error) {
    next(new Error(`unable to retrieve details for ${req.body.name}`))
  }
})

//DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    await Author.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: `successfully deleted details for ${req.body.name}` })
  } catch (error) {
    next(new Error(`unable to delete details for ${req.body.name}`))
  }
})

//error
router.use((err, req, res, next) => {
  res.status(500).json({ err: err.message })
});

module.exports = router;