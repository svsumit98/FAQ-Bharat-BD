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

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000)
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
    await clearFaqCache();
    res.status(200).json(faq);
  } catch (err) {
    res
      .status(500)
      .json({ error: "failed to create FAQ", details: err.message });
  }
});

faqRouter.get("/faqs", async (req, res) => {
  try {
    const lang = req.query.lang || "en";

    const cachedData = await redis.get(`faqs_${lang}`);
    if (cachedData) return res.json(JSON.parse(cachedData));

    const faqs = await Faq.find();
    if (!faqs.length) {
      return res.json({ message: "No FAQs found in database" });
    }
    const translatedFaqs = faqs.map((faq) => faq.getTranslatedFAQ(lang));

    await redis.setex(`faqs_${lang}`, 3600, JSON.stringify(translatedFaqs));

    res.json(translatedFaqs);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch FAQs", details: err.message });
  }
});

faqRouter.delete("/faqs/:id", async (req, res) => {
  try {
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    if (!deletedFaq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    await clearFaqCache();

    res.json({ message: "FAQ deleted successfully!!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete FAQ", details: err.message });
  }
});

module.exports = faqRouter;
