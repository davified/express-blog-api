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

test("POST /books should display 1 book", async () => {
  const author1 = new Author({
    username: "paulo",
    age: 49
  });

  const savedAuthor1 = await author1.save();

  const response = await request(app)
    .post("/books")
    .send({
      title: "Reactor",
      author: savedAuthor1._id
    });

  expect(response.status).toBe(201);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: `Reactor was successfully created`
  });
});

test("PUT /books/:id should update selected book", async () => {
  const author1 = new Author({
    username: "calvin",
    age: 35
  });

  const savedAuthor1 = await author1.save();

  const book1 = new Book({
    title: "React is hard",
    author: savedAuthor1._id
  });

  const savedBook1 = await book1.save();

  const response = await request(app)
    .put(`/books/${savedBook1._id}`)
    .send({
      title: "React is not too hard",
      author: savedAuthor1._id
    });

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toMatchObject({
    title: "React is not too hard"
  });
});

test("DELETE /books/:id should delete selected book", async () => {
  const author1 = new Author({
    username: "calvin",
    age: 35
  });

  const savedAuthor1 = await author1.save();

  const book1 = new Book({
    title: "React is hard",
    author: savedAuthor1._id
  });

  const savedBook1 = await book1.save();
  const response = await request(app).delete(`/books/${savedBook1._id}`);

  expect(response.status).toBe(200);

  const response2 = await request(app).get(`/books/${savedBook1._id}`);

  // Assert based on the fake data added
  expect(response2.body).toEqual([]);
});

test("GET /authors/:id should retrieve selected author", async () => {
  const author1 = new Author({
    username: "calvin",
    age: 35
  });

  const savedAuthor1 = await author1.save();

  const book1 = new Book({
    title: "React is hard",
    author: savedAuthor1._id
  });

  const savedBook1 = await book1.save();
  const response = await request(app).get(`/books/${savedBook1._id}`);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body[0].title).toEqual("React is hard");
  expect(response.body[0].author._id).toEqual(String(savedAuthor1._id));
});
