const mongoose = require('mongoose')
const {Schema} = mongoose

const bookSchema = Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const Book = mongoose.model("Book", bookSchema)
module.exports = Book