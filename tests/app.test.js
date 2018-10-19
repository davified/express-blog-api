// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book")

const app = require("../app");

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
  await addFakeData();
});

test("GET /authors", async () => {
  const response = await request(app).get("/authors");
  expect(response.status).toBe(200);
  // Assert based on the fake data added
  expect(response.body.length).toBe(2);
});

test("GET /books should display all books", async () => {
  const response = await request(app).get("/books");
  expect(response.status).toEqual(200);
  expect(response.body.length).toBe(2);
});

test("GET /index should display welcome message", async () => {
  const response = await request(app).get("/");
  expect(response.status).toEqual(200);
  expect(response.body.message).toBe("hello express-books-api")
});