const request = require("supertest");

//initialize MongoDB memory server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

const app = require("../app")

async function addFakeData() {
  const author1 = new Author({
    name: "paulo",
    verified: "true"
  });
  await author1.save();

  const author2 = new Author({
    name: "john",
    verified: "true"
  });
  await author2.save();

  const book1 = new Book({
    title: "paulo's book",
    author: `${author1._id}`,
    published_year: 2009
  });
  await book1.save();

  const book2 = new Book({
    title: "john's book",
    author: `${author2._id}`,
    published_year: 2018,
  });
  await book2.save();
}

beforeAll(async () => {
  jest.setTimeout(120000);
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
})

beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
  await addFakeData()
})

test("POST /books should create new author", async () => {
  const newAuthor = new Author({
    name: "new author",
    verified: "true"
  });
  const savedAuthor = await newAuthor.save()

  const newBook = new Book({
    title: "new author book",
    author: `${savedAuthor._id}`,
    published_year: 2015
  })
  const savedBook = await newBook.save()

  const result = await request(app).post("/books").send(savedBook)

  expect(result.status).toBe(201)
  expect(result.body.message).toEqual(`created new book from ${savedBook.title}`)
});

test("PUT /books/:id should update selected author", async () => {
  const book1 = await Book.find({ title: "paulo's book" })
  const resBody = { title: "updated paulo's book" }

  const result = await request(app).put(`/books/${book1[0]._id}`).send(resBody)

  expect(result.status).toBe(200)
  expect(result.body.message).toEqual(`update book with id ${resBody.title}`)
});

test("DELETE /books/:id should delete selected author", async () => {
  const book1 = await Book.find({ title: "paulo's book" })
  const result = await request(app).delete(`/books/${book1[0]._id}`)

  expect(result.status).toBe(200)
  expect(result.body.message).toEqual(`deleted book successfully`)
});

test("GET /books/:id should retrieve selected book", async () => {
  const book1 = await Book.find({ title: "paulo's book" })
  const result = await request(app).get(`/books/${book1[0]._id}`)

  expect(result.status).toBe(200)
  expect(result.body.message).toEqual(`get book with id ${book1[0]._id}`)
});