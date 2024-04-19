const express = require("express");
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


app.listen(5000, () => console.log(`Server running on port ${PORT}`));
