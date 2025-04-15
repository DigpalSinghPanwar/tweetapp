const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack);
});

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
