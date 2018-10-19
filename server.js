const app = require("./app");
const mongoose = require("mongoose");
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true }
);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to DB");
});

db.on("error", error => {
  console.error(error);
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});
