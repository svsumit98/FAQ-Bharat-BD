const express = require("express");
const Faq = require("../models/FaqSchema");
const faqRouter = express.Router();
const Redis = require("ioredis");
const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.project_id
});

faqRouter.post("/faqs", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Question and answer are required." });
    }

    const translations = {};
    const languages = ["hi", "fr", "ru"];
    for (const x of languages) {
      const [translatedQuestion] = await translate.translate(question, x);
      const [translatedAnswer] = await translate.translate(answer, x);
      translations[x] = {
        question: translatedQuestion,
        answer: translatedAnswer
      };
    }
    const faq = new Faq({ question, answer, translations });
    await faq.save();
    res.status(200).json(faq);
  } catch (err) {
    res
      .status(500)
      .json({ error: "failed to create FAQ", details: err.message });
  }
});

module.exports = faqRouter;
