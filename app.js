// invoke the dotenv package in order to allow the use of environment variables
require("dotenv").config();
// package to apply try and catch to all controllers automatically
require("express-async-errors");

// express

const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

// middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// morgan logger middleware
app.use(morgan("tiny"));

// middleware to allow access to json data
app.use(express.json());

// middleware to parse cookies
app.use(cookieParser(process.env.JWT_SECRET));

// make the public folder a static asset in the app
app.use(express.static("./public"));
// middleware to upload pictures
app.use(fileUpload());

// routes
app.get("/", (req, res) => {
  res.send("e-commerce api");
});

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("e-commerce api");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

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
