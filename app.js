// invoke the dotenv package in order to allow the use of environment variables
require("dotenv").config();
// package to apply try and catch to all controllers automatically
require("express-async-errors");

// express

const express = require("express");
const app = express();

// database
const connectDB = require("./db/connect");

// middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// middleware to allow access to json data
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("e-commerce api");
});

app.use(notFoundMiddleware);
// error handler needs to be the last one
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
