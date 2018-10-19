// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

const app = require("../app");

async function addFakeAuthors() {
  const author1 = new Author({
    name: "paulo",
    age: 49
  });

  await author1.save();

  const author2 = new Author({
    name: "john",
    age: 50
  });

  await author2.save();
}

async function addFakeBook() {
  const author1 = new Author({
    name: "mary",
    age: 23
  });
  const author2 = new Author({
    name: "yolanda",
    age: 33
  });
  const author1Id = await author1.save();
  const author2Id = await author2.save();
  const book1 = new Book({
    title: "A Book",
    author: author1Id._id
  });
  const book2 = new Book({
    title: "Another Book",
    author: author2Id._id
  });
  await book1.save();
  await book2.save();
}

beforeAll(async () => {
  // Increase timeout to allow MongoDB Memory Server to be donwloaded
  // the first time
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

beforeEach(async () => {
  // Clean DB between test runs
  mongoose.connection.db.dropDatabase();

  // Add fake data to the DB to be used in the tests
  await addFakeAuthors();
  await addFakeBook();
});

test("GET /authors", async () => {
  const response = await request(app).get("/authors");

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body.length).toBe(4);
});

test("GET /books should display all books", async () => {
  const response = await request(app).get("/books");

  expect(response.status).toBe(200);

  expect(response.body.length).toBe(2);
});

test("GET index should display welcome message", async () => {
    const response = await request(app).get("/")
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("hello express-books-api")
})