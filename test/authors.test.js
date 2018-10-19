// app.test.js
const express = require("express");
const request = require("supertest");

// Initialize MongoDB Memory Server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/authors");

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

test("POST /authors should display 1 author", async () => {
  const response = await request(app)
    .post("/authors")
    .send({
      username: "gladys",
      age: 18
    });

  expect(response.status).toBe(201);

  // Assert based on the fake data added
  expect(response.body).toEqual({
    message: `gladys was successfully created`
  });
});

test("PUT /authors/:id should update selected author", async () => {
  const author1 = new Author({
    username: "calvin",
    age: 35
  });

  const savedAuthor1 = await author1.save();
  const response = await request(app)
    .put(`/authors/${savedAuthor1._id}`)
    .send({
      username: "calvin",
      age: 36
    });

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body).toMatchObject({
    username: "calvin",
    age: 36
  });
});

test("DELETE /authors/:id should delete selected author", async () => {
  const author1 = new Author({
    username: "newcalvin",
    age: 5
  });

  const savedAuthor1 = await author1.save();
  const response = await request(app).delete(`/authors/${savedAuthor1._id}`);

  expect(response.status).toBe(200);

  const response2 = await request(app).get(`/authors/${savedAuthor1._id}`);

  // Assert based on the fake data added
  expect(response2.body).toEqual([]);
});

test("GET /authors/:id should retrieve selected author", async () => {
  const author1 = new Author({
    username: "oldcalvin",
    age: 99
  });

  const savedAuthor1 = await author1.save();
  const response = await request(app).get(`/authors/${savedAuthor1._id}`);

  expect(response.status).toBe(200);

  // Assert based on the fake data added
  expect(response.body[0]).toMatchObject({
    username: "oldcalvin",
    age: 99
  });
});
