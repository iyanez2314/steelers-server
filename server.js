const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoDbAtlasURL = process.env.MONGODBATLAS;
const app = express();
const sendgrid = require("@sendgrid/mail");
const sendGridAPIkey = process.env.SEND_GRID_API;
sendgrid.setApiKey(sendGridAPIkey);

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
app.post("/join", async (req, res) => {
  try {
    const user = new User({ email: req.body.email });
    await user.save();
    res.status(200).send("Thanks for signing up!");
  } catch (error) {
    res.status(500).send("There was an error please try again later");
  }
});

app.post("/emails", async (req, res) => {
  try {
    const users = await User.find({});
    const emailAddresses = users.map((user) => user.email);
    // Construction of the emails
    const message = {
      to: emailAddresses,
      from: "isaac231467@icloud.com",
      subject: req.body.subject,
      text: req.body.text,
    };
    // send using send grid
    await sendgrid.send(message);
    res.status(200).send("Emails have been sent!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
