const express = require("express");
const http = require('http');
const mongoose = require("mongoose");
const loginRoute = require("./routes/loginRoute");
const blogRoutes = require("./routes/blogRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

mongoose.connection.on("connection", () => {
  console.log("connect");
});

app.use("/api", loginRoute);
app.use("/api/blogs", blogRoutes);


app.use("/", (req, res) => {
  res.send("Server is running.");
});

const server = http.createServer(app);
server.listen(5000, () => { console.log('this app is running on ' + 5000) });
