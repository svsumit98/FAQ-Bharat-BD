const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://svsumit9810:Svsumit9810@nodejs.qgfkj.mongodb.net/FAQSchema"
  );
};

module.exports = { connectDB };
