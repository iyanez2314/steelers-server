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
          name: "Isaac Yanez",
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

      const date = req.body.date;
      const location = req.body.location;

      const emailHtml = template
        .replace("{{date}}", date)
        .replace("{{location}}", location);

      const msg = {
        to: emailAddresses,
        from: {
          email: owner,
          name: "Isaac Yanez",
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
