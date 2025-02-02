const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const faqRouter = require("./routes/faq");

app.use(express.json());
app.use("/", faqRouter);

connectDB()
  .then(() => {
    console.log("Database connection established!!");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
