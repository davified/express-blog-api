const express = require("express");
const request = require("supertest");

const MongodbMemoryServer = require("mongodb-memory-server").default;

const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

const app = require("../app");

beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
});

test("GET /books returns all books", async () => {
  const author1 = new Author({
    name: "John",
    age: 23
  });
  const authorSaved = await author1.save();
  const book1 = new Book({
    title: "A Book",
    author: authorSaved._id
  });
  const bookSaved = await book1.save();
  const response = await request(app).get("/books");
  expect(response.status).toBe(200);
  expect(response.body[0].title).toBe("A Book");
});

test("POST /books returns created book", async () => {
  const author1 = new Author({
    name: "John",
    age: 23
  });
  const authorSaved = await author1.save();
  const response = await request(app)
    .post("/books")
    .send({
      title: "Some Book",
      author: authorSaved._id
    });
  expect(response.status).toBe(201);
  expect(response.body.message).toBe("Saved Some Book");
});

test("PUT /books:id returns updated book", async () => {
  const author1 = new Author({
    name: "John",
    age: 23
  });
  const author2 = new Author({
    name: "Barry",
    age: 35
  });
  const authorSaved = await author1.save();
  const author2Saved = await author2.save();
  const book1 = new Book({
    title: "A Book",
    author: authorSaved._id
  });
  const bookSaved = await book1.save();
  const response = await request(app)
    .put(`/books/${bookSaved._id}`)
    .send({ title: "New Book", author: author2Saved._id });
  expect(response.status).toBe(200);
  expect(response.body.title).toBe("New Book");
});

test("DEL /books/:id deletes book", async () => {
  const author1 = new Author({
    name: "John",
    age: 23
  });
  const author2 = new Author({
    name: "Barry",
    age: 35
  });
  const authorSaved = await author1.save();
  const author2Saved = await author2.save();
  const book1 = new Book({
    title: "A Book",
    author: authorSaved._id
  });
  const bookSaved = await book1.save()
  const response = await request(app).delete(`/books/${bookSaved._id}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe(`Successfully deleted ${bookSaved._id}`);
});
