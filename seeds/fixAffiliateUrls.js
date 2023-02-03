require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../db/models/product");
(async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongo db is connected");
  } catch (e) {
    console.log(e);
  }
})();
const fixUrls = async () => {
  let allUrls = await Product.find({});
  for (let i = 1; i < 61; i++) {
    const newAffiliate = allUrls[i].affiliateLink.replace("></iframe>", "");
    await Product.findByIdAndUpdate(allUrls[i]._id, {
      affiliateLink: newAffiliate,
    });
  }
};
fixUrls();
