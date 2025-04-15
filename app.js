const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routers/userRoutes");
const tweetRouter = require("./routers/tweetRoutes");
const GlobalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json());

app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("welcome to tweet");
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweet", tweetRouter);

app.all("/{*splat}", (req, res, next) => {
  // res.status(404).json({
  //   status: "failed",
  //   message: `Can't find the ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find the ${req.originalUrl} on this server`);
  // err.statusCode = 404;
  // err.status = "fail";
  // next(err);
  next(new AppError(`Can't find the ${req.originalUrl} on this server`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
