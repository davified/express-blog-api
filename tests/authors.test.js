const request = require("supertest");

//initialize MongoDB memory server
const MongodbMemoryServer = require("mongodb-memory-server").default;
const mongod = new MongodbMemoryServer();
const mongoose = require("mongoose");
const Author = require("../models/author");
const Book = require("../models/book");

const app = require("../app")

beforeAll(async () => {
  jest.setTimeout(120000)
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
})

beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
})

test("POST /authors should create new author", async () => {
  const response = new Author({
    name: "add author",
    verified: "true"
  });

  const result = await request(app)
    .post(`/authors`)
    .send(response)
  expect(result.status).toEqual(201)
  expect(result.body.message).toEqual("new Author record successfully created")
});

test("PUT /authors/:id should update selected author", async () => {
  const newAuthor = new Author({
    name: "new author",
    verified: "true"
  });
  const savedAuthor = await newAuthor.save()

  const response = new Author({
    name: "updated new author"
  })

  const result = await request(app)
    .put(`/authors/${savedAuthor._id}`)
    .send(response)
  expect(result.status).toEqual(200)
  expect(result.body.message).toEqual(`successfully updated details for ${response.name}`);
});

test("DELETE /authors/:id should delete selected author", async () => {
  const newAuthor = new Author({
    name: "new author",
    verified: "true"
  });
  const savedAuthor = await newAuthor.save()

  const result = await request(app).delete(`/authors/${savedAuthor._id}`);
  expect(result.status).toEqual(200);
  expect(result.body.message).toEqual("successfully deleted details");
});

test("GET /authors/:id should retrieve selected author", async () => {
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

  const result = await request(app).get(`/authors/${savedAuthor._id}`)
  expect(result.status).toEqual(200);
  expect(result.body.author.name).toEqual("new author")
  expect(result.body.book[0].title).toEqual("new author book")
});