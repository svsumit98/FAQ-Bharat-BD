const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    translations: {
      type: Map,
      of: {
        question: String,
        answer: String
      }
    }
  },
  {
    timestamps: true
  }
);

FaqSchema.methods.getTranslatedFAQ = function (lang) {
  const translation = this.translations.get(lang);
  return {
    question: translation?.question || this.question,
    answer: translation?.answer || this.answer
  };
};

module.exports = mongoose.model("Faq", FaqSchema);
