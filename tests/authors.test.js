const express = require("express");
const request = require("supertest");

const MongodbMemoryServer = require("mongodb-memory-server").default;

const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");

const app = require("../app");

const newAuthor = new Author({
  name: "Gob",
  age: 45
});

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

test("POST /authors should create a new author", async () => {
  const newAuthor = {
    name: "Gob",
    age: 45
  };

  const response = await request(app)
    .post("/authors")
    .send(newAuthor);

  expect(response.status).toBe(201);
  expect(response.body.message).toBe("Saved author Gob");
});

test("PUT /authors/:id should update author", async () => {
  const author = await newAuthor.save();
  const response = await request(app)
    .put(`/authors/${author._id}`)
    .send({ name: "John", age: 54 });
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("John");
  expect(response.body.age).toBe(54);
});

test("DELETE /authors/:id should delete selected author", async () => {
  const author = await newAuthor.save();
  const response = await request(app).delete(`/authors/${author._id}`);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe(`Successfully deleted ${author._id}`);
});

test("GET /authors/:id should retrieve selected author", async () => {
  const newAuthor2 = new Author({
    name: "John",
    age: 45
  });
  const author = await newAuthor2.save();
  const response = await request(app).get(`/authors/${author._id}`);
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("John");
  expect(response.body.age).toBe(45);
});
