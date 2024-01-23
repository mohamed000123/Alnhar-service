const express = require("express");
const admin = require("firebase-admin");
const fs = require("fs");
const serviceAccount = JSON.parse(
  fs.readFileSync("./firebase-adminsdk.json", "utf-8")
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.listen("469", () => {
  console.log("server is running on port 8000");
});

// middelwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// routes
app.get("/", (req, res) => {
  res.render("form");
});

app.post("/send-notification", (req, res) => {
  try {
    const { title, body } = req.query;
    const message = {
      data: {
        title,
        body,
      },
      notification: {
        title,
        body,
      },
      topic: "allUsers",
    };
    admin
      .messaging()
      .send(message)
      .then(() => {
        res.status(200).json({
          success: true,
          message: "notification has been sent successfully",
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        res
          .status(500)
          .json({ success: false, message: "Error sending notification" });
      });
  } catch (err) {
    res.status(500).send(`sending error:  ${err}`);
  }
});
