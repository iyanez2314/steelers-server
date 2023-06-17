require("dotenv").config();
const fs = require("fs");
const sendgrid = require("@sendgrid/mail");
const sendGridAPIkey = process.env.SEND_GRID_API;
const owner = process.env.OWNER;
sendgrid.setApiKey(sendGridAPIkey);

module.exports.joinEmailSender = function (fileName, res, req, emailAddress) {
  try {
    fs.readFile(fileName, "utf-8", (err, template) => {
      if (err) {
        console.log("Error reading the email template: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const fullName = req.body.fullName;

      const emailHtml = template.replace("{{first_name}}", fullName);

      const msg = {
        to: emailAddress,
        from: {
          email: owner,
          name: "Javi Contreras",
        },
        subject: "Welcome To The South Texas Steelers Fan Club!",
        html: emailHtml,
      };

      sendgrid
        .send(msg)
        .then(() => {
          res.status(200).json({ message: "Email has been sent" });
        })
        .catch((error) => {
          console.error("OOPS there was an error: ", error);
          res.status(500).json({ error: "Internal Error" });
        });
    });
  } catch (error) {
    console.error("OOPS something went wrong: ", error);
  }
};

module.exports.emailSender = function (fileName, emailAddresses, req, res) {
  try {
    fs.readFile(fileName, "utf-8", (err, template) => {
      if (err) {
        console.log("Error reading the email template: ", err);
        return res
          .status(500)
          .json({ error: "Error Parsing the HTML Template" });
      }

      const message = req.body.message;

      const emailHtml = template.replace("{{message}}", message);

      const msg = {
        to: emailAddresses,
        from: {
          email: owner,
          name: "Javi Contreras",
        },
        subject: "South Texas Steelers Fan Club Meetup",
        html: emailHtml,
      };

      sendgrid
        .send(msg)
        .then(() => {
          res.status(200).json({ message: "Emails have been sent!" });
        })
        .catch((error) => {
          console.error("There was a problem sending emails : ", error);
          res.status(500).json({ error: error });
        });
    });
  } catch (error) {
    console.error("OOPS there is a internal error: ", error);
    res.status(500).json({ error: "Internal error" });
  }
};

module.exports.sendText = function (user) {
  const { name, email, phone } = user;
  const accountSid = "AC6ecd6b90a6647924a0b57f65c8470e83";
  const authToken = "e1bbc0b6b3633ec24ad486dad7c1036b";
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: `Welcome ${name} to the South Texas Steelers Fan Club! All of our updates will be sent to this number. If you would like to unsubscribe please reply with "UNSUBSCRIBE"`,
      from: "+18449961106",
      to: `+1${phone}`,
    })
    .then((message) => console.log(message.sid));
};

module.exports.removeText = function (user) {
  const { phone, name } = user;
  const accountSid = "AC6ecd6b90a6647924a0b57f65c8470e83";
  const authToken = "e1bbc0b6b3633ec24ad486dad7c1036b";

  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: `Sad to see you go ${name}! If you would like to rejoin please head back to our website and sign up again!`,
      from: "+18449961106",
      to: `+1${phone}`,
    })
    .then((message) => console.log(message))
    .catch((error) => console.log(error));
};
