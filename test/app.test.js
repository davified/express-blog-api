// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/authors");
const Book = require("../models/books");

const app = require("../app");

async function addFakeAuthors() {
  const author1 = new Author({
    username: "paulo",
    age: 49
  });

  await author1.save();

  const author2 = new Author({
    username: "john",
    age: 50
  });

  await author2.save();
}

async function addFakeBooks() {
  const author1 = new Author({
    username: "smith",
    age: 15
  });

  const savedAuthor1 = await author1.save();

  const author2 = new Author({
    username: "joe",
    age: 33
  });

  const savedAuthor2 = await author2.save();
  const book1 = new Book({
    title: "React 1",
    author: `${savedAuthor1._id}`
  });

  await book1.save();

  const book2 = new Book({
    title: "React 2",
    author: `${savedAuthor2._id}`
  });

  await book2.save();
}

beforeAll(async () => {
  // Increase timeout to allow MongoDB Memory Server to be donwloaded
  // the first time
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(
    uri,
    { useNewUrlParser: true }
  );
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

beforeEach(async () => {
  // Clean DB between test runs
  mongoose.connection.db.dropDatabase();

  // Add fake data to the DB to be used in the tests
});

test("GET /authors should display all authors", async () => {
  await addFakeAuthors();
  const response = await request(app).get("/authors");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(2);
});

test("GET /books should display all books", async () => {
  await addFakeBooks();
  const response = await request(app).get("/books");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(2);
});

test("GET /index should display all welcome message", async () => {
  const response = await request(app).get("/");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toEqual({ message: "hello express-books-api" });
});
