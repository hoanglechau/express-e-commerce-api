// invoke the dotenv package in order to allow the use of environment variables
require("dotenv").config();
// package to apply try and catch to all controllers automatically
require("express-async-errors");

// express

const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");

// database
const connectDB = require("./db/connect");

// routes
const authRouter = require("./routes/authRoutes");

// middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));

// middleware to allow access to json data
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("e-commerce api");
});

app.use("/api/v1/auth", authRouter);

// 404 Not Found is put after all the routes
app.use(notFoundMiddleware);
// Express rule: error handler needs to be the last one
// error handler is only invoked when there's an error in the normal routes, not in the non-existing routes
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
