const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const app = express();

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to MongoDB");
});
//   .catch((err) => {
//     console.error("Connection error", err);
//   });

// creating a middleware : a fn that has access to req and res object and the next fn in the appln req res cycle
app.use(express.json()); //using express server using json() to parse my data
app.use(helmet()); // helps in protecting our data
app.use(morgan("common")); // we have many options other than common : it shows the log data in format that include date time day along with response codes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
  console.log("The backend server is running");
});
