const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const userRouter = require("./routers/userRoutes");
const tweetRouter = require("./routers/tweetRoutes");
const commentRouter = require("./routers/commentRoutes");
const GlobalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

// console.log("🔥  CORS block is being registered");
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173", // or '*', but 'http://localhost:5173' is safer
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // <-- include PATCH
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.options("*", cors());

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, Please try again in an hour",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use((req, res, next) => {
  // console.log("welcome to tweet");
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/comment", commentRouter);

app.all("*", (req, res, next) => {
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
