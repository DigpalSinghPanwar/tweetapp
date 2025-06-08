const mongoose = require("mongoose");
const dotenv = require("dotenv");
process.on("uncaughtException", (err) => {
  // console.error("Uncaught Exception:", err.stack, err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

const app = require("./app");

const PORT = process.env.PORT || 8000;

const db = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

// console.log(process.argv);

mongoose.connect(db).then((res) => {
  // console.log(res.connections);
  console.log("db connected succesfully");
});

const server = app.listen(PORT, () => {
  console.log("server running on port");
});

process.on("unhandledRejection", (err) => {
  // console.log(err.name, err.message);
  // console.log("UNHANDLED REJECTION! Shutting Down....");
  server.close(() => {
    process.exit(1);
  });
});
