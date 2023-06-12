const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const {
  joinEmailSender,
  emailSender,
  sendText,
  sendTextTest,
} = require("./util");
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
  name: String,
  phone: String,
});

/* -------------------------------------------------------------------------- */
/*                               APP.USE SECTION                              */
/* -------------------------------------------------------------------------- */
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const port = process.env.PORT || 3000;

/* -------------------------------------------------------------------------- */
/*                              ENDPOINT TO JOIN                              */
/* -------------------------------------------------------------------------- */
app.post("/join", async (req, res) => {
  const userEmail = req.body.email;
  const usersName = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const existingUser = await User.findOne({ email: userEmail });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "sorry this email is already signed up!" });
  } else {
    const user = new User({
      email: userEmail,
      name: usersName,
      phone: phoneNumber,
    });
    const saveUser = await user.save();
    joinEmailSender("./join_template.html", res, req, userEmail);
    sendText(saveUser);
  }
});

app.post("/test", async (req, res) => {
  const body = req.body;
  sendTextTest(body);
});

/* -------------------------------------------------------------------------- */
/*                           ENDPOINT TO SEND EMAIL                           */
/* -------------------------------------------------------------------------- */
app.post("/emails", async (req, res) => {
  const users = await User.find({});
  const emailAddresses = users.map((user) => user.email);
  emailSender("./email_template.html", emailAddresses, req, res);
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
