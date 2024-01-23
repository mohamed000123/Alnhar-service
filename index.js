import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(
    "C:/Users/Besso/OneDrive/Desktop/Alnhar-service/firebase-adminsdk.json",
    "utf-8"
  )
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dotenv.config();

const app = express();

app.listen("8000", () => {
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
      .then((response) => {
        console.log("Successfully sent message:", response);
        res.status(200).json(`notification has been sent successfully`);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        res
          .status(500)
          .json({ success: false, error: "Error sending notification" });
      });
  } catch (err) {
    res.status(500).send(`sending error:  ${err}`);
  }
});
