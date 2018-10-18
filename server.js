//mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/express-books-api", { useNewUrlParser: true });

const db = mongoose.connection;
db.once("open", open => {
  console.log("connected to db")
})
db.on("error", error => {
  console.error("unable to connect to db")
})

//connection to localhost
const app = require("./app");
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});
