require("dotenv").config();
const delay = require("../helpers/delay");
const puppeteer = require("puppeteer");
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

// update all products images  to strip tool
const updateImages = async () => {
  let allProducts = await Product.find();
  allProducts = allProducts.filter((p) => p.store === "amazon");
  allProducts = allProducts.map((p) => {
    return { product_id: p._id, product_link: p.affiliateLink };
  });

  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100, // slow down actions by 100ms
      // args: ["--incognito"],
    });
    const page = await browser.newPage();

    // navigate to Amazon website
    await page.goto("https://www.amazon.com/");
    await page.click("#nav-link-accountList");
    await delay(3);
    await page.type("#ap_email", "mostafaswifyy@gmail.com");
    await page.click("#continue");
    await delay(3);
    await page.type("#ap_password", "mostafaelsouifi_zamalek_721995");
    await page.click("#signInSubmit");
    await delay(80);
    for (let i = 80; i < allProducts.length; i++) {
      await page.goto(allProducts[i].product_link);
      await page.click('span[data-action="amzn-ss-show-image-popover"]');
      await delay(3);
      await page.click("#amzn-ss-large-image-radio-button");
      await delay(3);
      let image = await page.evaluate(() => {
        return document
          .querySelector("#amzn-ss-image-textarea")
          .textContent.split("src=")[1]
          .replaceAll("></a><img", "")
          .replaceAll('"', "")
          .trim();
      });
      await delay(2);
      const updatedProduct = await Product.findByIdAndUpdate(
        allProducts[i].product_id,
        { image: image }
      );
      await updatedProduct.save();
      await delay(2);
    }
    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

updateImages();
