const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoDbAtlasURL = process.env.MONGODBATLAS;
const app = express();

// Mongoose connection to MongoDB Atlas
mongoose
  .connect(mongoDbAtlasURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the atlas DB");
  })
  .catch((error) => {
    console.error("Error connecting to the DB : ", error);
  });

// Schema for the user model
const User = mongoose.model("User", {
  email: String,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 3000;

// Route to add the users to the DB
app.use("/join", (req, res) => {});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
